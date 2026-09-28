// Tipos que espelham exatamente o schema existente no Supabase.
// Nenhuma tabela foi alterada — isto é apenas a representação em TypeScript
// das colunas que já existem em `products` e `movements`.

export type Product = {
  id: string
  code: string
  name: string
  description: string | null
  quantity: number
  location: string | null
  minimum_stock: number
  created_at: string
  updated_at: string
}

export type MovementType = 'entrada' | 'saida'

export type Movement = {
  id: string
  product_id: string
  type: MovementType
  quantity: number
  operator: string | null
  created_at: string
}

// Status derivado de quantity/minimum_stock (regra de negócio calculada em
// src/lib/stock.ts). Usado pelos badges de estoque no Dashboard e,
// futuramente, na página Produtos (Etapa 3).
export type StockStatus = 'em_estoque' | 'estoque_baixo' | 'sem_estoque'

// Formato retornado pela consulta de movimentações com o produto embutido
// (join via product_id -> products.id, feito pelo PostgREST/Supabase).
export type MovementWithProduct = {
  id: string
  type: MovementType
  quantity: number
  operator: string | null
  created_at: string
  product: {
    code: string
    name: string
  } | null
}

export type DashboardStats = {
  totalProducts: number
  totalStock: number
  lowStockCount: number
  totalMovements: number
}

// Payload enviado para a função RPC create_product.
export type NewProductInput = {
  name: string
  description: string
  quantity: number
  location: string
  minimum_stock: number
}

// Payload enviado para a função RPC register_movement.
export type RegisterMovementInput = {
  productId: string
  type: MovementType
  quantity: number
  operator: string
}

export type ProductStatusFilter = 'todos' | StockStatus
export type MovementTypeFilter = 'todas' | MovementType

export type ToastKind = 'success' | 'error' | 'info'

export type ToastMessage = {
  id: string
  kind: ToastKind
  message: string
}
