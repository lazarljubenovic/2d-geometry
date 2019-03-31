import typescript from 'rollup-plugin-typescript2'
import node from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: './dst',
  },
  plugins: [
    node(),
    typescript({
      typescript: require('typescript'),
    }),
  ],
}
