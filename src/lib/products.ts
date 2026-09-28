import { supabase } from './supabase'
import type {
  Movement,
  MovementWithProduct,
  NewProductInput,
  Product,
  RegisterMovementInput,
} from '../types'

const PRODUCT_COLUMNS =
  'id, code, name, description, quantity, location, minimum_stock, created_at, updated_at'

/** Traduz um erro do Supabase/PostgREST para uma mensagem amigável em pt-BR. */
function friendlyError(error: unknown, fallback: string): Error {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message)
    // As exceções lançadas pelas funções RPC (raise exception '...') chegam
    // aqui com a mensagem em português já pronta para exibir ao usuário.
    return new Error(message || fallback)
  }
  return new Error(fallback)
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw friendlyError(error, 'Não foi possível carregar os produtos.')
  return (data ?? []) as Product[]
}

export async function fetchProductByCode(code: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('code', code)
    .maybeSingle()

  if (error) throw friendlyError(error, 'Não foi possível carregar o produto.')
  return (data as Product) ?? null
}

export async function fetchProductMovements(
  productId: string
): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movements')
    .select('id, product_id, type, quantity, operator, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error)
    throw friendlyError(error, 'Não foi possível carregar o histórico do produto.')
  return (data ?? []) as Movement[]
}

export async function fetchAllMovements(): Promise<MovementWithProduct[]> {
  const { data, error } = await supabase
    .from('movements')
    .select(
      'id, type, quantity, operator, created_at, product:products(code, name)'
    )
    .order('created_at', { ascending: false })

  if (error)
    throw friendlyError(error, 'Não foi possível carregar as movimentações.')
  return (data ?? []) as unknown as MovementWithProduct[]
}

/**
 * Cadastra um produto via RPC `create_product`.
 * O código (LT-XXXXX) é gerado no banco por uma sequence — nunca no
 * frontend — então não existe risco de duplicação em cadastros simultâneos.
 */
export async function createProduct(input: NewProductInput): Promise<Product> {
  const { data, error } = await supabase.rpc('create_product', {
    p_name: input.name,
    p_description: input.description,
    p_quantity: input.quantity,
    p_location: input.location,
    p_minimum_stock: input.minimum_stock,
  })

  if (error) throw friendlyError(error, 'Não foi possível cadastrar o produto.')
  return data as Product
}

/**
 * Registra entrada ou saída via RPC `register_movement`.
 * Toda a validação (estoque insuficiente, quantidade inválida, produto
 * inexistente) e a atualização atômica do estoque acontecem no banco.
 */
export async function registerMovement(
  input: RegisterMovementInput
): Promise<Product> {
  const { data, error } = await supabase.rpc('register_movement', {
    p_product_id: input.productId,
    p_type: input.type,
    p_quantity: input.quantity,
    p_operator: input.operator,
  })

  if (error) {
    throw friendlyError(
      error,
      input.type === 'saida'
        ? 'Não foi possível registrar a saída.'
        : 'Não foi possível registrar a entrada.'
    )
  }
  return data as Product
}
