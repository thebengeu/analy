import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  input: 'collector/collector.ts',
  output: {
    dir: 'public',
    format: 'iife',
  },
  plugins: [typescript(), terser()],
})
