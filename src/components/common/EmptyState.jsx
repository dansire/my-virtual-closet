import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, text, actionTo, actionLabel }) {
  return (
    <div className="empty-state">
      {Icon && <span className="empty-icon"><Icon size={26} /></span>}
      <h3>{title}</h3>
      <p>{text}</p>
      {actionTo && <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>}
    </div>
  )
}