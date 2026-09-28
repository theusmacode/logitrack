/**
 * O QR Code guarda a URL completa da página do produto. Isso funciona tanto
 * em desenvolvimento (http://localhost:5173/produtos/LT-00001) quanto depois
 * do deploy (https://seu-dominio/produtos/LT-00001) — sempre aponta para o
 * domínio de onde o QR foi gerado.
 */
export function buildProductQrValue(code: string): string {
  return `${window.location.origin}/produtos/${code}`
}

/**
 * Aceita tanto um código puro (LT-00001) quanto uma URL contendo o código
 * (útil se o QR foi gerado por uma versão anterior do sistema, ou lido de
 * uma etiqueta impressa por outro dispositivo). Retorna null se não
 * encontrar um padrão de código válido.
 */
export function extractProductCode(raw: string): string | null {
  const match = raw.trim().match(/LT-\d+/i)
  return match ? match[0].toUpperCase() : null
}
