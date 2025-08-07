module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: { 
    es6: true,
    browser: true,
    node: true
  },
  rules: {
    semi: [2, 'never'],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off'
  }
}
