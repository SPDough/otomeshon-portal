import { createTheme, alpha, ThemeOptions } from '@mui/material/styles';

const colors = {
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  accent: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },
  // Modern surface palette
  surface: {
    page: '#f8f9fb',      // Cool gray tint for page background
    card: '#ffffff',       // Pure white cards
    hover: 'rgba(0,0,0,0.015)',
    elevated: '#ffffff',
  },
};

// Modern typography with dramatic hierarchy
const modernTypography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  // Page titles: bold, large, tight tracking
  h1: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.15 },
  // Section headers
  h2: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 },
  // Card titles
  h3: { fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.4 },
  // Sub-headings
  h4: { fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.4 },
  h5: { fontSize: '0.8125rem', fontWeight: 500 },
  h6: { fontSize: '0.75rem', fontWeight: 500 },
  // Body: smaller, tighter for finance density
  body1: { fontSize: '0.8125rem', lineHeight: 1.5 },
  body2: { fontSize: '0.75rem', lineHeight: 1.5 },
  // Section labels: all-caps with generous tracking
  subtitle1: { fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.01em' },
  subtitle2: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  button: { fontWeight: 500, textTransform: 'none' as const, letterSpacing: '0.01em' },
  caption: { fontSize: '0.6875rem', lineHeight: 1.4 },
};

// Row background tints for contextual coloring
export const rowStatusTints: Record<string, string> = {
  COMPLETED: 'transparent',
  IN_PROGRESS: 'rgba(59, 130, 246, 0.03)',
  EXCEPTION: 'rgba(220, 38, 38, 0.035)',
  PENDING: 'rgba(217, 119, 6, 0.025)',
  AWAITING_PRICE: 'rgba(168, 85, 247, 0.03)',
  MANUAL_OVERRIDE: 'rgba(249, 115, 22, 0.03)',
  APPROVED: 'rgba(22, 163, 74, 0.03)',
  REJECTED: 'rgba(220, 38, 38, 0.035)',
};

// Status dot colors (for dot+label pattern)
export const statusDotColors: Record<string, string> = {
  COMPLETED: '#16a34a',
  IN_PROGRESS: '#2563eb',
  EXCEPTION: '#dc2626',
  PENDING: '#d97706',
  AWAITING_PRICE: '#a855f7',
  MANUAL_OVERRIDE: '#f97316',
  APPROVED: '#16a34a',
  REJECTED: '#dc2626',
};

// Financial workflow status colors (for chips when needed)
export const workflowStatusColors: Record<string, { bg: string; text: string; border: string }> = {
  PENDING:        { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
  IN_PROGRESS:    { bg: '#dbeafe', text: '#1e40af', border: '#60a5fa' },
  COMPLETED:      { bg: '#d1fae5', text: '#065f46', border: '#34d399' },
  EXCEPTION:      { bg: '#fee2e2', text: '#991b1b', border: '#f87171' },
  AWAITING_PRICE: { bg: '#f3e8ff', text: '#6b21a8', border: '#a78bfa' },
  MANUAL_OVERRIDE:{ bg: '#ffedd5', text: '#9a3412', border: '#fb923c' },
  APPROVED:       { bg: '#d1fae5', text: '#065f46', border: '#34d399' },
  REJECTED:       { bg: '#fee2e2', text: '#991b1b', border: '#f87171' },
};

// Modern subtle shadows
const modernShadows: ThemeOptions['shadows'] = [
  'none',
  '0 1px 2px rgba(0,0,0,0.04)',                                    // 1 - card default
  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',       // 2 - card hover
  '0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',       // 3 - dropdown
  '0 8px 16px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)',      // 4 - modal
  '0 12px 24px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.04)',     // 5 - elevated
  '0 20px 40px rgba(0,0,0,0.1)',                                    // 6 - max
  ...Array(19).fill('0 4px 8px rgba(0,0,0,0.06)'),
] as ThemeOptions['shadows'];

const sharedShape = { borderRadius: 10 };

const modernComponents = (isDark: boolean) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin' as const,
        '&::-webkit-scrollbar': { width: '6px', height: '6px' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: isDark ? colors.slate[600] : colors.slate[300],
          borderRadius: '3px',
        },
      },
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0 as const },
    styleOverrides: {
      root: {
        backgroundColor: isDark ? '#0a0e1a' : '#ffffff',
        color: isDark ? colors.slate[100] : colors.slate[900],
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: isDark ? '#0a0e1a' : '#ffffff',
        borderRight: 'none',
        boxShadow: isDark ? 'none' : '2px 0 8px rgba(0,0,0,0.03)',
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true as const },
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 16px',
        transition: 'transform 0.1s ease, box-shadow 0.15s ease, background-color 0.15s ease',
        '&:active': { transform: 'scale(0.97)' },
        fontSize: '0.8125rem',
      },
      contained: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.08)' },
      },
      outlined: {
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        '&:hover': {
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
          backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
        },
      },
    },
  },
  // MODERN CARDS: borderless, subtle shadow only
  MuiCard: {
    defaultProps: { elevation: 0 as const },
    styleOverrides: {
      root: {
        border: 'none',
        borderRadius: 12,
        backgroundColor: isDark ? '#111827' : '#ffffff',
        boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.06)',
        },
      },
    },
  },
  // MODERN TABLES: minimal headers, light dividers
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '10px 16px',
        fontSize: '0.8125rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9',
        transition: 'background-color 0.15s ease',
      },
      head: {
        fontWeight: 600,
        fontSize: '0.6875rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: isDark ? colors.slate[500] : colors.slate[400],
        backgroundColor: 'transparent',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        padding: '12px 16px',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
        },
        '&:last-child td': { borderBottom: 'none' },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: isDark ? colors.slate[800] : colors.slate[50],
          transition: 'all 0.2s ease',
          '& fieldset': { borderColor: isDark ? colors.slate[600] : colors.slate[200] },
          '&:hover fieldset': { borderColor: isDark ? colors.slate[500] : colors.slate[300] },
          '&.Mui-focused': { backgroundColor: isDark ? colors.slate[700] : '#ffffff' },
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '2px 8px',
        padding: '8px 12px',
        transition: 'all 0.15s ease',
        '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
        '&.Mui-selected': {
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.06)',
          '&:hover': { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 600,
        fontSize: '0.6875rem',
        height: 22,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'all 0.15s ease',
        '&:active': { transform: 'scale(0.92)' },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: isDark ? colors.slate[800] : colors.slate[50],
        '& fieldset': { borderColor: isDark ? colors.slate[600] : colors.slate[200] },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8', contrastText: '#ffffff' },
    secondary: { main: colors.slate[100], light: colors.slate[50], dark: colors.slate[200], contrastText: colors.slate[700] },
    background: { default: '#f8f9fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#94a3b8' },
    divider: '#e2e8f0',
    action: { hover: 'rgba(0,0,0,0.03)', selected: 'rgba(37, 99, 235, 0.06)' },
    success: { main: '#16a34a', light: '#22c55e', dark: '#15803d', contrastText: '#ffffff' },
    error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c', contrastText: '#ffffff' },
    warning: { main: '#d97706', light: '#f59e0b', dark: '#b45309', contrastText: '#ffffff' },
    info: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8', contrastText: '#ffffff' },
  },
  typography: modernTypography,
  shape: sharedShape,
  shadows: modernShadows,
  components: modernComponents(false),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', contrastText: '#ffffff' },
    secondary: { main: colors.slate[800], light: colors.slate[700], dark: colors.slate[900], contrastText: colors.slate[200] },
    background: { default: '#0a0e1a', paper: '#111827' },
    text: { primary: '#f1f5f9', secondary: '#64748b' },
    divider: 'rgba(255,255,255,0.06)',
    action: { hover: 'rgba(255,255,255,0.04)', selected: 'rgba(59, 130, 246, 0.1)' },
    success: { main: '#22c55e' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    info: { main: '#60a5fa' },
  },
  typography: modernTypography,
  shape: sharedShape,
  shadows: modernShadows,
  components: modernComponents(true),
});

// Compact variant for financial data density
const compactTypography = {
  ...modernTypography,
  body1: { fontSize: '0.8125rem', lineHeight: 1.4 },
  body2: { fontSize: '0.75rem', lineHeight: 1.4 },
};

export const compactLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8', contrastText: '#ffffff' },
    secondary: { main: colors.slate[100], light: colors.slate[50], dark: colors.slate[200], contrastText: colors.slate[700] },
    background: { default: '#f8f9fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#94a3b8' },
    divider: '#e2e8f0',
    action: { hover: 'rgba(0,0,0,0.03)', selected: 'rgba(37, 99, 235, 0.06)' },
    success: { main: '#16a34a', light: '#22c55e', dark: '#15803d', contrastText: '#ffffff' },
    error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c', contrastText: '#ffffff' },
    warning: { main: '#d97706', light: '#f59e0b', dark: '#b45309', contrastText: '#ffffff' },
    info: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8', contrastText: '#ffffff' },
  },
  typography: compactTypography,
  shape: { borderRadius: 8 },
  shadows: modernShadows,
  components: {
    ...modernComponents(false),
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '6px 12px', fontSize: '0.8125rem', borderBottom: '1px solid #f1f5f9' },
        head: { fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#94a3b8', backgroundColor: 'transparent', borderBottom: '1px solid #e2e8f0', padding: '8px 12px' },
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' } } },
    MuiButton: { styleOverrides: { root: { padding: '6px 12px', fontSize: '0.8125rem', '&:active': { transform: 'scale(0.97)' } } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 4, fontSize: '0.6875rem', height: 20 } } },
  },
});

export const compactDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', contrastText: '#ffffff' },
    secondary: { main: colors.slate[800], light: colors.slate[700], dark: colors.slate[900], contrastText: colors.slate[200] },
    background: { default: '#0a0e1a', paper: '#111827' },
    text: { primary: '#f1f5f9', secondary: '#64748b' },
    divider: 'rgba(255,255,255,0.06)',
    action: { hover: 'rgba(255,255,255,0.04)', selected: 'rgba(59, 130, 246, 0.1)' },
    info: { main: '#60a5fa' },
    success: { main: '#34d399' },
    warning: { main: '#fbbf24' },
    error: { main: '#f87171' },
  },
  typography: compactTypography,
  shape: { borderRadius: 8 },
  shadows: modernShadows,
  components: {
    ...modernComponents(true),
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '6px 12px', fontSize: '0.8125rem', borderBottom: '1px solid rgba(255,255,255,0.04)' },
        head: { fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: colors.slate[500], backgroundColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 12px' },
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' } } },
    MuiButton: { styleOverrides: { root: { padding: '6px 12px', fontSize: '0.8125rem', '&:active': { transform: 'scale(0.97)' } } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 4, fontSize: '0.6875rem', height: 20 } } },
  },
});

// Default export for backward compatibility
export default lightTheme;
