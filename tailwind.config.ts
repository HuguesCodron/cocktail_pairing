import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF2FA',
          card: '#FFFAFD',
          border: '#EBD9E8'
        },
        ink: {
          DEFAULT: '#2D2438',
          muted: '#7B6F88'
        },
        rose: {
          DEFAULT: '#C6648B',
          pastel: '#F4D6E1'
        },
        sage: {
          DEFAULT: '#7BA084',
          pastel: '#D4E3D7'
        },
        lavender: {
          DEFAULT: '#8A5BA8',
          pastel: '#E4D4ED'
        }
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        tightest: '-0.03em'
      }
    }
  },
  plugins: [animate]
};

export default config;
