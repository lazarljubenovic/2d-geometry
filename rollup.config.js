import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: './dst',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
}
