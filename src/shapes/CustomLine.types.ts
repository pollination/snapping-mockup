import { TLBaseShape } from '@tldraw/tldraw'

export type CustomLineShape = TLBaseShape<
  'custom-line',
  {
    name: string
    start: number[]
    end: number[]
  }
>
