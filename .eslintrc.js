module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended' // or 'plugin:vue/base'
  ],
  plugins: ['html'],
  parser: 'babel-eslint',
  env: { es6: true },
  rules: {
    semi: [2, 'never']
  }
}
