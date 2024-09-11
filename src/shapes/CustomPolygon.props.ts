import { RecordProps, T } from '@tldraw/tldraw'
import { CustomPolygonShape } from './CustomPolygon.types'

export const customPolygonProps: RecordProps<CustomPolygonShape> = {
  name: T.string,
  points: T.arrayOf(T.arrayOf(T.number))
}
