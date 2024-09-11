import { createShapeId, Editor, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { CustomPolygonUtil } from './shapes/CustomPolygonUtil'
import { useState } from 'react'

const customShapeUtils = [CustomPolygonUtil]

export default function SnappingSample() {
  const [editor, setEditor] = useState<Editor | null>(null)
  return (
    <div
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        className="tldraw__editor"
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <Tldraw
          persistenceKey="example"
          onMount={(editor) => {
            ;(editor as any).customSnapping = {
              weight: 0.5,
            }
            setEditor(editor)
            editor.createShapes([
              {
                id: createShapeId('a1'),
                type: 'custom-polygon',
              },
              {
                id: createShapeId('a2'),
                type: 'custom-polygon',
                props: {
                  points: [
                    [150, 0],
                    [250, 0],
                    [250, 100],
                    [150, 100],
                  ],
                },
              },
            ])
          }}
          shapeUtils={customShapeUtils}
        />
      </div>
      {editor && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: 40,
            left: 20,
          }}
        >
          <h3>Custom Snapping</h3>
          <div>
            <input
              type="checkbox"
              id="end"
              name="scales"
              onChange={(e) =>
                ((editor as any).customSnapping.end = e.target.checked)
              }
            />
            <label htmlFor="end">End</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="middle"
              name="scales"
              onChange={(e) =>
                ((editor as any).customSnapping.middle = e.target.checked)
              }
            />
            <label htmlFor="middle">Middle</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="grid"
              name="scales"
              onChange={(e) => {
                ;(editor as any).customSnapping.grid = e.target.checked
                editor.updateInstanceState({
                  isGridMode: e.target.checked,
                })
              }}
            />
            <label htmlFor="grid">Grid</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="nearest"
              name="scales"
              onChange={(e) =>
                ((editor as any).customSnapping.nearest = e.target.checked)
              }
            />
            <label htmlFor="nearest">Nearest</label>
          </div>
          <div>
            <input
              type="number"
              id="weight"
              min={0.1}
              step={0.1}
              max={1.0}
              defaultValue={(editor as any).customSnapping.weight}
              onChange={(e) =>
                ((editor as any).customSnapping.weight = Number(e.target.value))
              }
            />
            <label htmlFor="weight">Weight</label>
          </div>
        </div>
      )}
    </div>
  )
}
