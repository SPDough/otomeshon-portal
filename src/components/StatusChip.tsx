import { Box, Typography } from '@mui/material';
import { workflowStatusColors, statusDotColors } from '@/theme';
import { alpha } from '@mui/material/styles';

interface StatusChipProps {
  status: string;
  size?: 'small' | 'medium';
}

// Modern dot+label pattern — 6px colored dot with text label
const StatusChip = ({ status, size = 'small' }: StatusChipProps) => {
  const color = statusDotColors[status] || statusDotColors['PENDING'];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'small' ? 0.75 : 1,
      }}
    >
      <Box
        sx={{
          width: size === 'small' ? 6 : 8,
          height: size === 'small' ? 6 : 8,
          borderRadius: '50%',
          bgcolor: color,
          boxShadow: `0 0 0 2px ${alpha(color, 0.15)}`,
          flexShrink: 0,
          ...(status === 'IN_PROGRESS' && {
            animation: 'pulse-dot 2s ease-in-out infinite',
          }),
          '@keyframes pulse-dot': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.35 },
          },
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontSize: size === 'small' ? '0.8125rem' : '0.875rem',
          fontWeight: 500,
          color: 'text.primary',
          lineHeight: 1,
        }}
      >
        {status.replace(/_/g, ' ')}
      </Typography>
    </Box>
  );
};

export default StatusChip;

// Standalone exception count badge for navbar
export const ExceptionBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -1,
        right: -1,
        minWidth: 16,
        height: 16,
        borderRadius: '50%',
        bgcolor: 'error.main',
        color: 'error.contrastText',
        fontSize: '0.6rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 0.5,
        border: '2px solid',
        borderColor: 'background.paper',
      }}
    >
      {count}
    </Box>
  );
};

// Trend indicator: small arrow + delta percentage
interface TrendIndicatorProps {
  current: number;
  previous: number;
}

export const TrendIndicator = ({ current, previous }: TrendIndicatorProps) => {
  if (previous === 0) return null;
  const delta = ((current - previous) / previous) * 100;
  const isUp = delta >= 0;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, mt: 0.25 }}>
      <Typography
        variant="caption"
        sx={{
          color: isUp ? '#16a34a' : '#dc2626',
          fontWeight: 600,
          fontSize: '0.6875rem',
        }}
      >
        {isUp ? '+' : ''}{delta.toFixed(2)}%
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
        vs yest
      </Typography>
    </Box>
  );
};

// Done indicator for completed items
export const DoneIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        bgcolor: '#16a34a',
      }}
    />
    <Typography variant="caption" color="#16a34a" fontWeight={600} fontSize="0.75rem">
      Done
    </Typography>
  </Box>
);

// Fallback chip when a filled badge is still needed (e.g., in compact spaces)
export const StatusBadge = ({ status, size = 'small' }: StatusChipProps) => {
  const config = workflowStatusColors[status] || workflowStatusColors['PENDING'];
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: size === 'small' ? 1 : 1.25,
        py: size === 'small' ? 0.25 : 0.375,
        borderRadius: 1,
        bgcolor: alpha(config.bg, 0.6),
        color: config.text,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
        letterSpacing: '0.02em',
        border: `1px solid ${alpha(config.border, 0.15)}`,
        height: size === 'small' ? 20 : 24,
      }}
    >
      {status.replace(/_/g, ' ')}
    </Box>
  );
};
