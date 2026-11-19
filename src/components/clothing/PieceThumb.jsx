import { Shirt } from 'lucide-react'
import { useImageUrl } from '../../hooks/useImageUrl'

// Miniatura de una prenda: su foto o, si no tiene, su color.
export default function PieceThumb({ item }) {
  const url = useImageUrl(item?.imageId)
  return (
    <div className="piece-thumb">
      {url ? (
        <img src={url} alt={item.name} />
      ) : (
        <span className="piece-fallback" style={{ background: item?.mainColor }}>
          <Shirt size={20} />
        </span>
      )}
    </div>
  )
}
