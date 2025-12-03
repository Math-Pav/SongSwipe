export const colors = {
  gradientPrimary: ['#0a014f', '#120078', '#9d00ff'],
  gradientSecondary: ['#4facfe', '#00f2fe'],
  gradientAccent: ['#f093fb', '#f5576c'],
  gradientSuccess: ['#00ff88', '#00cc6a'],
  gradientDanger: ['#ff6b6b', '#ee5a5a'],
  gradientGold: ['#ffd700', '#ffaa00'],
  
  primary: '#9d00ff',
  primaryDark: '#0a014f',
  primaryLight: '#c77dff',
  
  secondary: '#4facfe',
  accent: '#f093fb',
  success: '#00ff88',
  error: '#ff3366',
  warning: '#ffd700',
  
  white: '#ffffff',
  black: '#000000',
  dark: '#0a0a1a',
  darkCard: '#1a1a2e',
  
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardOverlay: 'rgba(26, 26, 46, 0.9)',
  glassEffect: 'rgba(255, 255, 255, 0.1)',
  glassEffectStrong: 'rgba(255, 255, 255, 0.15)',
  
  disabled: '#666666',
  placeholder: '#888888',
  
  neonPink: '#ff00c8',
  neonPurple: '#b300ff',
  neonBlue: '#00f2fe',
  neonGreen: '#00ff88',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    extraBold: 'System',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
    hero: 56,
  },
  
  h1: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  neon: {
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
};
