type EmptyStateProps = {
  icon: string
  title: string
  message: string
  stageNote?: string
}

/**
 * Estado vazio padrão, usado em páginas cuja lógica real ainda não foi
 * implementada. Deixa explícito para quem está usando o protótipo que
 * aquilo é uma prévia de navegação, não uma funcionalidade quebrada.
 */
function EmptyState({ icon, title, message, stageNote }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {stageNote && <span className="stage-note">{stageNote}</span>}
    </div>
  )
}

export default EmptyState
