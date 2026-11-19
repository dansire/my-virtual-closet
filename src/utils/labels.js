// Dado un listado [{ value, label }] devuelve la etiqueta de un valor.
export const labelOf = (list, value) => list.find((i) => i.value === value)?.label ?? value
