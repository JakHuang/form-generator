module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'airbnb-base'
  ],
  rules: {
    'linebreak-style': 0,
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-unused-components': 0,
    'no-unused-vars': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'comma-dangle': [2, 'never'],
    semi: [2, 'never'],
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
    'no-param-reassign': 0,
    'arrow-parens': [2, 'as-needed'],
<<<<<<< HEAD
    "vue/max-attributes-per-line": 0,
    'max-len': [1,
=======
    'vue/max-attributes-per-line': [
      1,
      {
        multiline: {
          max: 3,
        },
      },
    ],
    'max-len': [
      1,
>>>>>>> 50d9d50... feat: 添加monaco editor 保存以后自动刷新
      {
        code: 120,
      },
    ],
    'no-eval': 0,
    'no-multi-assign': 0,
<<<<<<< HEAD
    'prefer-rest-params': 0,
    'vue/require-prop-types': 0,
    'no-restricted-globals': 0
=======
    'no-restricted-globals': 1
>>>>>>> 50d9d50... feat: 添加monaco editor 保存以后自动刷新
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  globals: {
    location: false
  },
};
