import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import PieceThumb from '../clothing/PieceThumb'

export default function DayCell({ date, inMonth, isToday, isSelected, outfit, pieces, onSelect }) {
  const label = format(date, "d 'de' MMMM", { locale: es })
  const classes = ['day-cell', inMonth ? '' : 'out', isToday ? 'today' : '', isSelected ? 'selected' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={() => onSelect(date)}
      aria-pressed={isSelected}
      aria-label={outfit ? `${label}, outfit: ${outfit.name}` : label}
    >
      <span className="day-num">{format(date, 'd')}</span>
      {pieces.length > 0 && (
        <span className="day-mini">
          {pieces.slice(0, 3).map((piece) => (
            <span key={piece.slot.key} className="day-tile">
              {piece.item && <PieceThumb item={piece.item} />}
            </span>
          ))}
        </span>
      )}
    </button>
  )
}
