import { createFont, createTamagui, createTokens } from 'tamagui';

const palette = {
  white: '#FFFFFF',
  lavender: '#EBEFFF',
  periwinkle: '#C2CEFE',
  neonBlue: '#3960FB',
  pennBlue: '#14258B',
  black: '#000000',
  gray50: '#F8F9FA',
  gray100: '#E9ECEF',
  gray200: '#DEE2E6',
  gray300: '#CED4DA',
  gray400: '#ADB5BD',
  gray500: '#6C757D',
  gray600: '#495057',
};

const tokens = createTokens({
  color: {
    background: palette.lavender,
    backgroundDark: palette.pennBlue,
    card: palette.white,
    cardAlt: palette.lavender,
    cardDark: palette.pennBlue,
    text: palette.black,
    textDark: palette.white,
    muted: palette.gray500,
    mutedDark: palette.gray400,
    border: palette.gray300,
    borderDark: palette.periwinkle,
    accent: palette.neonBlue,
    accentAlt: palette.periwinkle,
    accentDark: palette.neonBlue,
    accentDarkAlt: palette.periwinkle,
  },
  radius: {
    0: 0,
    2: 2,
    3: 8,
    4: 12,
    5: 16,
    6: 20,
    7: 24,
    8: 32,
    true: 12,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    true: 16,
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    true: 16,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    true: 0,
  },
});

const baseFontSize = {
  1: 12,
  2: 14,
  3: 16,
  4: 18,
  5: 20,
  6: 24,
  7: 30,
  8: 36,
  true: 16,
};

const baseLineHeight = {
  1: 16,
  2: 18,
  3: 20,
  4: 24,
  5: 28,
  6: 32,
  7: 36,
  8: 44,
  true: 20,
};

const sans = createFont({
  family: 'System',
  size: baseFontSize,
  lineHeight: baseLineHeight,
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
    6: '800',
    7: '900',
    true: '400',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    true: 0,
  },
  face: {},
});

export const tamaguiConfig = createTamagui({
  defaultTheme: 'light',
  shorthands: {
    f: 'flex',
    fd: 'flexDirection',
    ai: 'alignItems',
    jc: 'justifyContent',
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
  },
  fonts: {
    heading: sans,
    body: sans,
    mono: sans,
  },
  tokens,
  themes: {
    light: {
      background: '$background',
      card: '$card',
      cardAlt: '$cardAlt',
      text: '$text',
      muted: '$muted',
      border: '$border',
      accent: '$accent',
      accentAlt: '$accentAlt',
    },
    dark: {
      background: '$backgroundDark',
      card: '$cardDark',
      cardAlt: '$cardDark',
      text: '$textDark',
      muted: '$mutedDark',
      border: '$borderDark',
      accent: '$accentDark',
      accentAlt: '$accentDarkAlt',
    },
  },
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
