// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', 'android/*', 'ios/*', '.expo/*'],
    rules: {
      // JavaScript/TypeScript 基础规则
      'no-console': 'warn', // 警告使用console
      'no-debugger': 'error', // 禁止使用debugger
      'no-var': 'error', // 禁止使用var
      'prefer-const': 'error', // 优先使用const
      'eqeqeq': ['error', 'always'], // 强制使用===
      'curly': ['error', 'all'], // 强制使用大括号
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }], // 限制空行数量
      
      // React 相关规则
      'react/jsx-uses-react': 'off', // React 17+ 不需要import React
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要import React
      'react/prop-types': 'off', // 使用TypeScript时关闭prop-types检查
      'react/display-name': 'warn', // 组件需要displayName
      'react/jsx-key': 'error', // 列表项需要key
      'react/jsx-no-duplicate-props': 'error', // 禁止重复的props
      'react/jsx-pascal-case': 'error', // 组件名使用PascalCase
      
      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error', // Hooks规则
      'react-hooks/exhaustive-deps': 'warn', // useEffect依赖项检查
      
      // 代码风格规则
      'indent': ['error', 2], // 2空格缩进
      'quotes': ['error', 'single'], // 使用单引号
      'semi': ['error', 'always'], // 强制使用分号
      'comma-dangle': ['error', 'always-multiline'], // 多行时使用尾随逗号
      'object-curly-spacing': ['error', 'always'], // 对象大括号内空格
      'array-bracket-spacing': ['error', 'never'], // 数组方括号内不加空格
      'jsx-quotes': ['error', 'prefer-double'], // JSX使用双引号
      
      // Import/Export 规则
      'import/order': ['warn', {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }],
      'import/no-duplicates': 'error', // 禁止重复导入
    },
  },
]);
