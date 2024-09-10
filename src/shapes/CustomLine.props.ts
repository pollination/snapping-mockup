import { RecordProps, T } from '@tldraw/tldraw'
import { CustomLineShape } from './CustomLine.types'

export const customLineProps: RecordProps<CustomLineShape> = {
  name: T.string,
  start: T.arrayOf(T.number),
  end: T.arrayOf(T.number),
}
