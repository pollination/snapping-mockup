import { createShapeId, Editor, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { CustomLineUtil } from './shapes/CustomLineUtil'
import { useState } from 'react'

const customShapeUtils = [CustomLineUtil]

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
                type: 'custom-line',
                props: {
                  start: [200, -200],
                  end: [0, 0],
                },
              },
              {
                id: createShapeId('a2'),
                type: 'custom-line',
                props: {
                  start: [0, 0],
                  end: [200, 200],
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
              min={0.01}
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
