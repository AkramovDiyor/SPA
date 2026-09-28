/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // important: true — чтобы Tailwind-утилиты побеждали Mantine при конфликтах
  important: true,
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
    },
  },
  corePlugins: {
    preflight: false, // отключаем reset, чтобы не ломать Mantine
  },
};