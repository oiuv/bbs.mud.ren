module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: { browser: true, node: true, es2022: true },
  globals: { $: 'readonly', _: 'readonly', TencentCaptcha: 'readonly' },
  rules: {
    semi: [2, 'never'],
    // Existing Vue 2 components use names such as app, editor, and navbar.
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off'
  }
}
