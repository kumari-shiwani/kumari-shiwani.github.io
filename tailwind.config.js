/** @type {import('tailwindcss').Config} */
export default {
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // wide AND landscape: tablets held upright use the stacked phone layout
        land: { raw: '(min-width: 768px) and (orientation: landscape)' },
      },
      colors: {
        paper: '#ebe6db',
        card: '#f4f0e8',
        ink: '#171512',
        muted: '#6f695e',
        thread: '#c8302a',
        sun: '#ecdc66',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
