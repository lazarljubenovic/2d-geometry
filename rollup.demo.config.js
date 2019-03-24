import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'

export default {
  input: './src/demo/index.ts',
  output: {
    format: 'iife',
    file: './demo/index.js',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    copy({
      './src/demo/index.html': './demo/index.html',
    }),
  ],
}
