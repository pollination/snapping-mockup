import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SnappingSample from './SnappingSample'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnappingSample />
  </StrictMode>
)
