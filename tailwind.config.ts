import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ['class', 'class'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontSize: {
  			'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
  			'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
  			'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
  			'h3': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3', fontWeight: '600' }],
  			'h4': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.4', fontWeight: '600' }],
  			'h5': ['clamp(1rem, 1.5vw, 1.25rem)', { lineHeight: '1.5', fontWeight: '600' }],
  			'h6': ['clamp(0.875rem, 1vw, 1rem)', { lineHeight: '1.5', fontWeight: '600' }],
  			'body-xs': ['0.75rem', { lineHeight: '1.5' }],
  			'body-sm': ['0.875rem', { lineHeight: '1.5714285714' }],
  			'body': ['1rem', { lineHeight: '1.5' }],
  			'body-lg': ['1.125rem', { lineHeight: '1.5555555556' }],
  			'body-xl': ['1.25rem', { lineHeight: '1.6' }],
  			'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
  			'overline': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
  		},
  		lineHeight: {
  			'tighter': '1.1',
  			'tight': '1.2',
  			'snug': '1.3',
  			'normal': '1.5',
  			'relaxed': '1.625',
  			'loose': '2',
  		},
  		letterSpacing: {
  			'tightest': '-0.05em',
  			'tighter': '-0.025em',
  			'tight': '-0.01em',
  			'normal': '0',
  			'wide': '0.01em',
  			'wider': '0.025em',
  			'widest': '0.05em',
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: '#C4B5FD',
  				dark: '#8B5CF6',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			danger: {
  				DEFAULT: '#DC2626',
  				light: '#F87171',
  				dark: '#B91C1C'
  			},
  			neutral: {
  				DEFAULT: '#F8FAFC',
  				dark: '#1E293B',
  				darker: '#0F172A'
  			},
  			text: {
  				DEFAULT: '#0F172A',
  				light: '#64748B',
  				dark: '#F8FAFC'
  			},
  			surface: {
  				light: '#FFFFFF',
  				dark: '#1E293B'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				light: '#7DD3FC',
  				dark: '#0EA5E9',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		boxShadow: {
  			subtle: '0 1px 3px rgba(0,0,0,0.05)',
  			hover: '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      margin: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      gridTemplateColumns: {
        '26': 'repeat(26, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
      },
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addBase }: { addBase: Function }) {
      addBase({
        ':root': {
          '--sat': 'env(safe-area-inset-top)',
          '--sar': 'env(safe-area-inset-right)',
          '--sab': 'env(safe-area-inset-bottom)',
          '--sal': 'env(safe-area-inset-left)',
        },
      });
    },
    plugin(function({ addComponents, theme }: { addComponents: Function, theme: Function }) {
      addComponents({
        '.text-display': {
          fontSize: theme('fontSize.display[0]'),
          lineHeight: theme('fontSize.display[1].lineHeight'),
          letterSpacing: theme('fontSize.display[1].letterSpacing'),
          fontWeight: theme('fontSize.display[1].fontWeight'),
        },
        '.text-h1': {
          fontSize: theme('fontSize.h1[0]'),
          lineHeight: theme('fontSize.h1[1].lineHeight'),
          letterSpacing: theme('fontSize.h1[1].letterSpacing'),
          fontWeight: theme('fontSize.h1[1].fontWeight'),
        },
        '.text-h2': {
          fontSize: theme('fontSize.h2[0]'),
          lineHeight: theme('fontSize.h2[1].lineHeight'),
          letterSpacing: theme('fontSize.h2[1].letterSpacing'),
          fontWeight: theme('fontSize.h2[1].fontWeight'),
        },
        '.text-h3': {
          fontSize: theme('fontSize.h3[0]'),
          lineHeight: theme('fontSize.h3[1].lineHeight'),
          letterSpacing: theme('fontSize.h3[1].letterSpacing', '0'),
          fontWeight: theme('fontSize.h3[1].fontWeight'),
        },
        '.text-h4': {
          fontSize: theme('fontSize.h4[0]'),
          lineHeight: theme('fontSize.h4[1].lineHeight'),
          letterSpacing: theme('fontSize.h4[1].letterSpacing', '0'),
          fontWeight: theme('fontSize.h4[1].fontWeight'),
        },
        '.text-h5': {
          fontSize: theme('fontSize.h5[0]'),
          lineHeight: theme('fontSize.h5[1].lineHeight'),
          letterSpacing: theme('fontSize.h5[1].letterSpacing', '0'),
          fontWeight: theme('fontSize.h5[1].fontWeight'),
        },
        '.text-h6': {
          fontSize: theme('fontSize.h6[0]'),
          lineHeight: theme('fontSize.h6[1].lineHeight'),
          letterSpacing: theme('fontSize.h6[1].letterSpacing', '0'),
          fontWeight: theme('fontSize.h6[1].fontWeight'),
        },
        '.text-body-xs': {
          fontSize: theme('fontSize.body-xs[0]'),
          lineHeight: theme('fontSize.body-xs[1].lineHeight'),
        },
        '.text-body-sm': {
          fontSize: theme('fontSize.body-sm[0]'),
          lineHeight: theme('fontSize.body-sm[1].lineHeight'),
        },
        '.text-body': {
          fontSize: theme('fontSize.body[0]'),
          lineHeight: theme('fontSize.body[1].lineHeight'),
        },
        '.text-body-lg': {
          fontSize: theme('fontSize.body-lg[0]'),
          lineHeight: theme('fontSize.body-lg[1].lineHeight'),
        },
        '.text-body-xl': {
          fontSize: theme('fontSize.body-xl[0]'),
          lineHeight: theme('fontSize.body-xl[1].lineHeight'),
        },
        '.text-caption': {
          fontSize: theme('fontSize.caption[0]'),
          lineHeight: theme('fontSize.caption[1].lineHeight'),
          letterSpacing: theme('fontSize.caption[1].letterSpacing'),
        },
        '.text-overline': {
          fontSize: theme('fontSize.overline[0]'),
          lineHeight: theme('fontSize.overline[1].lineHeight'),
          letterSpacing: theme('fontSize.overline[1].letterSpacing'),
          textTransform: 'uppercase',
        },
      });
    }),
  ],
} satisfies Config;
