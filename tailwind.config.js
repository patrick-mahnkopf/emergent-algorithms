const body = "#0E0B16";
const theme = "#4717F6";
const theme_accent = "#5a2df7";
const demo_ui = "#4b89e7";

// prettier-ignore
module.exports = {
  prefix: "",
  purge: {
    enabled: process?.argv?.indexOf("build") !== -1,
    content: [
      "./src/**/*.html",
      "./src/**/*.ts",
    ]
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'body': body,
        'body-accent': '#171225',
        'selected-text': '#A3A3FF',
        'accent': '#e6e6e6',
        'theme': theme,
        'theme-accent': theme_accent,
        'demo-ui': demo_ui,
        'nav': '#404053',
        'secondary': '#9191A4',
        'badge': '#3F3F51',
        'input-border': '#565666',
        'input': '#2A2A35'
      },
      fill: {
        'theme-accent': theme_accent,
        'demo-ui': demo_ui,
      },
      fontFamily: {
        'poppins': ["'Poppins'", 'sans-serif']
      },
      width: {
        '16px': '16px',
        '24px': '24px',
        '48px': '48px',
        '45p': '45%',
        '49p': '49%',
        '90p': '90%'
      },
      height: {
        '16px': '16px',
        '24px': '24px',
        '48px': '48px',
        '45p': '45%',
        '144': '36rem'
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/portfolio/hero/background.webp')",
        'emergent-pattern': "url('/assets/emergent_demos/hero/background.webp')"
      },
      outline: {
        'theme': ['2px solid ' + theme, '-2px'],
        'body': ['2px solid ' + body, '-2px'],
        'theme-accent': ['2px solid ' + theme_accent, '-2px']
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '1/3': '33.33%'
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      boxShadow: {
        'slider': '-9999px 0 0 9999px' + demo_ui
      }
    },
  },
  variants: {
    extend: {},
  },
};
