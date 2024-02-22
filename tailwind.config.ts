import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  daisyui: {
    themes: [
      {
        theme: {
          "primary": '#044A8E',
          "secondary": '#FFFFFF',
          "accent": '#FCC138',
          "neutral": "#1c1c1c",
          "base-100": "#cccccc"
          // "neutral": '#1D232A',
          // "base-100": "#1D232A",
        }
      }
    ]
  }
}
export default config
