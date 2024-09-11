import { TLBaseShape } from '@tldraw/tldraw'

export type CustomPolygonShape = TLBaseShape<
  'custom-polygon',
  {
    name: string
    points: number[][]
  }
>
