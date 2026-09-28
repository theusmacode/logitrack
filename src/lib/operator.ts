const STORAGE_KEY = 'logitrack:last-operator'

export function getLastOperator(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    // Navegador pode bloquear localStorage (modo privado, etc.) — degrada
    // graciosamente para "sem operador salvo" em vez de quebrar a tela.
    return ''
  }
}

export function saveLastOperator(operator: string): void {
  try {
    if (operator.trim()) {
      localStorage.setItem(STORAGE_KEY, operator.trim())
    }
  } catch {
    // Ignorado de propósito: lembrar o operador é uma conveniência, não uma
    // funcionalidade crítica.
  }
}
