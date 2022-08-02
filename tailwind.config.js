const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'dmss-accent1-50': '#FF9900',
        'dmss-accent1-100': '#F39200',
        'dmss-accent2-50': '#19FFBA',
        'dmss-accent2-100': '#13BF8A',
        'dmss-error': '#F20040',
        'dmss-bright': '#08A8DD',
        'dmss-dark': '#063D61',
        'dmss-dark-black': '#000921',
      },
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      backgroundSize: {
        'w-full': '100% auto',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'page-cockpit': "url('/scenes/cockpit.png')",
        'page-mint': "url('/scenes/space.png')",
        'page-mint-mobile': "url('/scenes/space-mobile.png')",
        // 'page-pharmacy': "url('/scenes/pharmacy.png')",
        'page-arcaderoom': "url('/scenes/arcaderoom.png')",
        'page-pharmacy':
          "url('https://www.NFTspacesquad.com/wp-content/uploads/2022/02/Illustration_Pharmacy-Laboratory.png')",
      },
    },
  },
  variants: {
    backgroundImage: ['dark'],
    borderColor: ['dark', 'hover'],
    textColor: ['dark', 'hover'],
    divideColor: ['dark'],
    gradientColorStops: ['dark', 'hover'],
    translate: ['dark'],
    opacity: ['dark', 'group-hover'],
    duration: ['dark'],
    scale: ['group-hover'],
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'page-cockpit',
    'page-mint',
    'page-pharmacy',
    'page-arcaderoom',
    'page-mint-mobile',
    'font-poppins',
    'font-extrabold',
    'w-1/5',
    'w-2/5',
    'w-3/5',
    'w-4/5',
    'w-5/5',
  ],
}
