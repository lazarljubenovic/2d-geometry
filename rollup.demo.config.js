import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import node from 'rollup-plugin-node-resolve'

export default {
  input: './src/demo/index.ts',
  output: {
    format: 'iife',
    file: './demo/index.js',
  },
  plugins: [
    node(),
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
        }
      }
    }),
    copy({
      './src/demo/index.html': './demo/index.html',
    }),
  ],
}
