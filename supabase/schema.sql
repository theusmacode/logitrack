-- =============================================================================
-- LogiTrack — supabase/schema.sql
-- =============================================================================
-- Este script é NÃO-DESTRUTIVO:
--   - não apaga tabelas
--   - não apaga dados
--   - não desativa RLS
--   - só adiciona policies, uma sequence, funções e índices
--
-- Pode ser executado mais de uma vez sem efeitos colaterais (idempotente):
-- usamos "drop ... if exists" antes de recriar policies/funções, e
-- "create ... if not exists" para sequence/índices.
--
-- Rode este arquivo inteiro no SQL Editor do painel do Supabase.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. LEITURA PÚBLICA (RLS)
-- -----------------------------------------------------------------------------
-- O protótipo não usa autenticação de usuário, então liberamos SELECT público
-- em ambas as tabelas. Isso é o que já permitia o Dashboard funcionar.
--
-- IMPORTANTE: não liberamos INSERT/UPDATE/DELETE diretos aqui. Toda escrita
-- passa pelas funções RPC da seção 3, que rodam como SECURITY DEFINER.
-- Isso significa que, mesmo com a chave pública exposta no frontend, ninguém
-- consegue inserir/alterar produtos ou movimentações fora das regras de
-- negócio (nome obrigatório, estoque nunca negativo, código nunca duplicado).
-- -----------------------------------------------------------------------------

alter table public.products enable row level security;
alter table public.movements enable row level security;

drop policy if exists "Permitir leitura publica de produtos" on public.products;
create policy "Permitir leitura publica de produtos"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "Permitir leitura publica de movimentacoes" on public.movements;
create policy "Permitir leitura publica de movimentacoes"
on public.movements
for select
to anon, authenticated
using (true);


-- -----------------------------------------------------------------------------
-- 2. GERAÇÃO SEGURA DE CÓDIGO (sequence)
-- -----------------------------------------------------------------------------
-- Uma sequence do PostgreSQL é atômica por natureza: duas chamadas simultâneas
-- a nextval() NUNCA retornam o mesmo número, mesmo sem lock explícito.
-- Por isso não usamos "select count(*) + 1", que teria condição de corrida.
--
-- A sequence é inicializada a partir do maior número já usado em `products`,
-- para continuar a partir do LT-00001 existente (não reinicia do zero).
-- -----------------------------------------------------------------------------

create sequence if not exists public.products_code_seq;

do $$
declare
  v_max integer;
begin
  select coalesce(max((regexp_match(code, '(\d+)$'))[1]::integer), 0)
  into v_max
  from public.products;

  if v_max > (select last_value from public.products_code_seq) then
    perform setval('public.products_code_seq', v_max);
  end if;
end $$;


-- -----------------------------------------------------------------------------
-- 3. FUNÇÕES RPC (SECURITY DEFINER)
-- -----------------------------------------------------------------------------

-- 3.1 create_product
-- Cadastra um produto, gera o código (LT-XXXXX) e, se a quantidade inicial
-- for maior que zero, registra automaticamente uma movimentação de entrada
-- para manter o histórico consistente desde o primeiro dia do produto.
create or replace function public.create_product(
  p_name text,
  p_description text,
  p_quantity integer,
  p_location text,
  p_minimum_stock integer
)
returns public.products
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_product public.products;
begin
  if p_name is null or btrim(p_name) = '' then
    raise exception 'Nome do produto é obrigatório.';
  end if;

  if p_quantity is null or p_quantity < 0 then
    raise exception 'Quantidade inicial não pode ser negativa.';
  end if;

  if p_minimum_stock is null or p_minimum_stock < 0 then
    raise exception 'Estoque mínimo não pode ser negativo.';
  end if;

  v_code := 'LT-' || lpad(nextval('public.products_code_seq')::text, 5, '0');

  insert into public.products (code, name, description, quantity, location, minimum_stock)
  values (
    v_code,
    btrim(p_name),
    nullif(btrim(coalesce(p_description, '')), ''),
    p_quantity,
    nullif(btrim(coalesce(p_location, '')), ''),
    p_minimum_stock
  )
  returning * into v_product;

  if p_quantity > 0 then
    insert into public.movements (product_id, type, quantity, operator)
    values (v_product.id, 'entrada', p_quantity, 'Cadastro inicial');
  end if;

  return v_product;
end;
$$;

grant execute on function public.create_product(text, text, integer, text, integer)
  to anon, authenticated;


-- 3.2 register_movement
-- Registra entrada ou saída de estoque de forma atômica:
--   1. trava a linha do produto (FOR UPDATE) até o fim da transação
--   2. valida tipo e quantidade
--   3. para saída, impede quantidade > estoque disponível
--   4. atualiza o estoque
--   5. insere a movimentação
-- Tudo dentro da mesma transação implícita da função — se qualquer passo
-- falhar, nada é gravado (nem o update, nem o insert).
create or replace function public.register_movement(
  p_product_id uuid,
  p_type text,
  p_quantity integer,
  p_operator text
)
returns public.products
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product public.products;
begin
  if p_type not in ('entrada', 'saida') then
    raise exception 'Tipo de movimentação inválido.';
  end if;

  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantidade deve ser maior que zero.';
  end if;

  select *
  into v_product
  from public.products
  where id = p_product_id
  for update;

  if not found then
    raise exception 'Produto não encontrado.';
  end if;

  if p_type = 'saida' and p_quantity > v_product.quantity then
    raise exception 'Estoque insuficiente. Disponível: %', v_product.quantity;
  end if;

  update public.products
  set
    quantity = case
      when p_type = 'entrada' then quantity + p_quantity
      else quantity - p_quantity
    end,
    updated_at = now()
  where id = p_product_id
  returning * into v_product;

  insert into public.movements (product_id, type, quantity, operator)
  values (p_product_id, p_type, p_quantity, nullif(btrim(coalesce(p_operator, '')), ''));

  return v_product;
end;
$$;

grant execute on function public.register_movement(uuid, text, integer, text)
  to anon, authenticated;


-- -----------------------------------------------------------------------------
-- 4. ÍNDICES
-- -----------------------------------------------------------------------------
-- Aceleram: a página de Movimentações (ordenar por data), o histórico de um
-- produto específico (filtrar por product_id) e a busca por código.
-- -----------------------------------------------------------------------------

create index if not exists idx_movements_product_id on public.movements (product_id);
create index if not exists idx_movements_created_at on public.movements (created_at desc);
create index if not exists idx_products_code on public.products (code);
