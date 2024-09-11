import {
  Circle2d,
  Editor,
  Polygon2d,
  Polyline2d,
  TLHandle,
  TLShapeId,
  Vec,
} from '@tldraw/tldraw'

// TODO: Add perpendicular
export type SnapOptions = {
  grid?: boolean
  end?: boolean
  middle?: boolean
  nearest?: boolean
}

/**
 * SnapManager use handles for snapping scope
 */
export class SnapManager {
  private _editor = {} as Editor
  private _radius = 100

  static SCALE_FACTOR: number = 100

  /**
   * Create a new snap manager
   */
  constructor(editor: Editor, weight: number = 1) {
    this._editor = editor
    this._radius = weight * SnapManager.SCALE_FACTOR
  }

  /**
   * Snap to grid
   */
  private snapToGrid(handle: TLHandle): Vec[] {
    const { _editor: editor } = this

    const isGridMode = editor.getInstanceState().isGridMode
    const gridSize = editor.getDocumentSettings().gridSize
    const pt = new Vec(handle.x, handle.y)

    if (isGridMode) {
      pt.snapToGrid(gridSize)
    }

    return [pt]
  }

  /**
   * Snap to points
   */
  private snapToPoints(handle: TLHandle, options: SnapOptions): Vec[] {
    const { _editor: editor } = this

    const pt = new Vec(handle.x, handle.y)

    const ids = editor.snaps.getSnappableShapes()

    // Intensity
    const circle = new Circle2d({
      isFilled: true,
      x: pt.x,
      y: pt.y,
      radius: this._radius,
    })

    const vertices: Vec[] = []
    ids.forEach((id: TLShapeId) => {
      const shape = editor.getShape(id)
      if (!shape) return

      const util = editor.getShapeUtil(shape)
      if (options.nearest) {
        const nearest = util.getGeometry(shape).nearestPoint(pt)
        vertices.push(nearest)
      } else if (options.end) {
        const ends = util.getGeometry(shape).vertices ?? []
        const filteredPts = this.getWeightedPoints(ends, circle)
        vertices.push(...filteredPts)
      } else if (options.middle) {
        const geo = util.getGeometry(shape)

        let center
        if (geo instanceof Polygon2d) {
          const cpoints = geo.segments.map((e) => e.center)
          const filteredPts = this.getWeightedPoints(cpoints, circle)
          vertices.push(...filteredPts)
        } else if (geo instanceof Polyline2d && geo.segments.length === 1) {
          center = util.getGeometry(shape).center
          const filteredPts = this.getWeightedPoints([center], circle)
          vertices.push(...filteredPts)
        } else {
          // Add other cases
        }
      } else {
        // Do nothing
      }
    })

    return vertices
  }

  private getWeightedPoints(pts: Vec[], circle: Circle2d) {
    return pts?.filter((v: Vec) => circle.distanceToPoint(v) < this._radius)
  }

  public snap(
    initialHandle: TLHandle,
    nextHandle: TLHandle,
    options: SnapOptions
  ) {
    const { _editor: editor } = this

    const isGridMode = editor.getInstanceState().isGridMode

    // By options
    const endPts = options?.end
      ? this.snapToPoints(nextHandle, { end: true })
      : []
    const nearestPts = options?.nearest
      ? this.snapToPoints(nextHandle, { nearest: true })
      : []
    const midPts = options?.middle
      ? this.snapToPoints(nextHandle, { middle: true })
      : []
    const gridPts = options?.grid ? this.snapToGrid(nextHandle) : []

    // Grid size is the snap intensity
    const gridSize = editor.getDocumentSettings().gridSize

    // Join options
    const points = [...endPts, ...nearestPts, ...midPts]

    const testPoint = new Vec(nextHandle.x, nextHandle.y)

    const distances = points.map((v: Vec) => {
      let dist = v.dist(testPoint)
      if (isNaN(dist)) dist = Infinity
      return dist
    })
    const minDist = Math.min(...distances)

    if (options.grid && isGridMode) {
      let gridDist = testPoint.dist(gridPts[0])

      if (isNaN(gridDist)) gridDist = Infinity

      if (minDist < gridSize) {
        const index = distances.indexOf(minDist)
        const point = points[index]
        nextHandle = { ...initialHandle, x: point.x, y: point.y }
      } else {
        nextHandle = { ...initialHandle, x: gridPts[0].x, y: gridPts[0].y }
      }
    } else {
      if (minDist < this._radius) {
        const index = distances.indexOf(minDist)
        const point = points[index]
        nextHandle = { ...initialHandle, x: point.x, y: point.y }
      } else {
        // Do nothing
      }
    }

    return nextHandle
  }
}
