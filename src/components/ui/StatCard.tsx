type StatCardProps = {
  label: string
  value: string
  detail: string
  icon: string
  loading?: boolean
}

/**
 * Cartão de estatística do Dashboard.
 *
 * `loading` indica que a busca no Supabase ainda está em andamento. Nesse
 * estado mostramos "—" em vez de um número, para nunca exibir um valor
 * desatualizado ou inventado como se fosse real.
 */
function StatCard({ label, value, detail, icon, loading }: StatCardProps) {
  return (
    <div className={`stat-card ${loading ? 'stat-card--pending' : ''}`}>
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">{icon}</div>
      </div>

      <strong>{loading ? '—' : value}</strong>

      <small>{detail}</small>
    </div>
  )
}

export default StatCard
