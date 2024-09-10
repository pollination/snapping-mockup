import {
  IndexKey,
  Polyline2d,
  SVGContainer,
  ShapeUtil,
  TLHandle,
  Vec,
  structuredClone,
} from '@tldraw/tldraw'
import { CustomLineShape } from './CustomLine.types'
import { customLineProps } from './CustomLine.props'
import { SnapManager } from '../snapping/SnapManager'

export class CustomLineUtil extends ShapeUtil<CustomLineShape> {
  static override type = 'custom-line' as const
  static override props = customLineProps

  override hideResizeHandles = () => true
  override hideRotateHandle = () => true

  getDefaultProps(): CustomLineShape['props'] {
    return {
      name: 'Line',
      start: [0, 0],
      end: [100, 0],
    }
  }

  getGeometry(shape: CustomLineShape) {
    return new Polyline2d({
      points: [shape.props.start, shape.props.end].map(Vec.FromArray),
    })
  }

  /**
   * Snapping here
   */
  override onHandleDrag = (
    shape: CustomLineShape,
    { handle }: { handle: TLHandle }
  ) => {
    const next = structuredClone(shape)
    const {
      inputs: { currentPagePoint, ctrlKey },
    } = this.editor
    const { x, y } = currentPagePoint

    const snapManager = new SnapManager(
      this.editor,
      Number((this.editor as any)?.customSnapping?.weight)
    )
    let nextHandle = { ...handle, x: x, y: y } as TLHandle

    if (!ctrlKey) {
      nextHandle = snapManager.snap(handle, nextHandle, {
        middle: (this.editor as any)?.customSnapping?.middle,
        end: (this.editor as any)?.customSnapping?.end,
        grid: (this.editor as any)?.customSnapping?.grid,
        nearest: (this.editor as any)?.customSnapping?.nearest,
      })
    }

    if (Number(handle.id) === 0) {
      next.props.start = [nextHandle.x, nextHandle.y]
    } else {
      next.props.end = [nextHandle.x, nextHandle.y]
    }

    return next
  }

  getHandles(shape: CustomLineShape): TLHandle[] {
    const line = this.editor.getShapeGeometry(shape) as Polyline2d
    const handles = line.vertices.map((v: Vec, i: number) => {
      return {
        id: `${i}`,
        type: 'vertex',
        canBind: false,
        canSnap: true,
        index: `cl${i}` as IndexKey,
        x: v.x,
        y: v.y,
      }
    }) as TLHandle[]

    return handles
  }

  override onTranslateEnd = (
    initial: CustomLineShape,
    current: CustomLineShape
  ) => {
    const { x: newX, y: newY } = current
    const { x: prevX, y: prevY } = initial

    const deltaX = newX - prevX
    const deltaY = newY - prevY

    const next = structuredClone(current)

    const newLine = {
      ...next,
      x: 0,
      y: 0,
      props: {
        ...next.props,
        start: [next.props.start[0] + deltaX, next.props.start[1] + deltaY],
        end: [next.props.end[0] + deltaX, next.props.end[1] + deltaY],
      },
    } as CustomLineShape

    this.editor.updateShape(newLine)
  }

  component(shape: CustomLineShape) {
    const line = this.editor.getShapeGeometry(shape) as Polyline2d
    const path = line.toSimpleSvgPath()

    return (
      <SVGContainer>
        <path d={path} stroke="black" fill="none" strokeWidth={2} />
      </SVGContainer>
    )
  }

  indicator(shape: CustomLineShape) {
    const line = this.editor.getShapeGeometry(shape) as Polyline2d
    const path = line.toSimpleSvgPath()

    return (
      <SVGContainer>
        <path d={path} stroke="blue" strokeWidth={1} />
      </SVGContainer>
    )
  }
}
