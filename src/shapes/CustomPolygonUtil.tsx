import {
  IndexKey,
  Polygon2d,
  SVGContainer,
  ShapeUtil,
  TLHandle,
  Vec,
  structuredClone,
} from '@tldraw/tldraw'
import { CustomPolygonShape } from './CustomPolygon.types'
import { customPolygonProps } from './CustomPolygon.props'
import { SnapManager } from '../snapping/SnapManager'

export class CustomPolygonUtil extends ShapeUtil<CustomPolygonShape> {
  static override type = 'custom-polygon' as const
  static override props = customPolygonProps

  override hideResizeHandles = () => true
  override hideRotateHandle = () => true

  getDefaultProps(): CustomPolygonShape['props'] {
    return {
      name: 'Polygon',
      points: [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100],
      ],
    }
  }

  getGeometry(shape: CustomPolygonShape) {
    // const pts: number[][] = [ ...shape.props.points,
    //   [ ...shape.props.points].pop() as number[] ]

    return new Polygon2d({
      points: shape.props.points.map(Vec.FromArray),
      isFilled: false,
    })
  }

  /**
   * Snapping here
   */
  override onHandleDrag = (
    shape: CustomPolygonShape,
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
    next.props.points[Number(handle.id)] = [nextHandle.x, nextHandle.y]

    return next
  }

  getHandles(shape: CustomPolygonShape): TLHandle[] {
    const polygon = this.editor.getShapeGeometry(shape) as Polygon2d
    const handles = polygon.vertices.map((v: Vec, i: number) => {
      return {
        id: `${i}`,
        type: 'vertex',
        canBind: false,
        canSnap: true,
        index: `p${i}` as IndexKey,
        x: v.x,
        y: v.y,
      }
    }) as TLHandle[]

    return handles
  }

  override onTranslateEnd = (
    initial: CustomPolygonShape,
    current: CustomPolygonShape
  ) => {
    const { x: newX, y: newY } = current
    const { x: prevX, y: prevY } = initial

    const deltaX = newX - prevX
    const deltaY = newY - prevY

    const next = structuredClone(current)

    const pts = next.props.points.map(([x, y]) => [x + deltaX, y + deltaY])

    const newLine = {
      ...next,
      x: 0,
      y: 0,
      props: {
        ...next.props,
        points: pts,
      },
    } as CustomPolygonShape

    this.editor.updateShape(newLine)
  }

  component(shape: CustomPolygonShape) {
    const polygon = this.editor.getShapeGeometry(shape) as Polygon2d
    const path = polygon.toSimpleSvgPath()

    return (
      <SVGContainer>
        <path d={path} stroke="black" fill="none" strokeWidth={2} />
      </SVGContainer>
    )
  }

  indicator(shape: CustomPolygonShape) {
    const polygon = this.editor.getShapeGeometry(shape) as Polygon2d
    const path = polygon.toSimpleSvgPath()

    return (
      <SVGContainer>
        <path d={path} stroke="blue" strokeWidth={1} />
      </SVGContainer>
    )
  }
}
