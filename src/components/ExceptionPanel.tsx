import { useState } from 'react';
import {
  Drawer, Box, Typography, List, ListItem, Button, Divider, Chip, alpha,
} from '@mui/material';
import {
  Warning as WarningIcon, Close as CloseIcon,
  TrendingUp as PriceIcon, Error as ErrorIcon,
  Business as CorpActionIcon, Sync as SyncIcon,
} from '@mui/icons-material';

export interface Exception {
  id: string;
  type: 'PRICE_MISSING' | 'MAPPING_ERROR' | 'CORPORATE_ACTION' | 'VALIDATION_FAILED' | 'CASH_BREAK';
  severity: 'CRITICAL' | 'WARNING';
  fundId: string;
  fundName: string;
  description: string;
  detail: string;
  timestamp: string;
  actions: { label: string; action: string }[];
}

const EXCEPTION_ICONS: Record<string, typeof WarningIcon> = {
  PRICE_MISSING: PriceIcon,
  MAPPING_ERROR: ErrorIcon,
  CORPORATE_ACTION: CorpActionIcon,
  VALIDATION_FAILED: WarningIcon,
  CASH_BREAK: SyncIcon,
};

const SEVERITY_COLORS = {
  CRITICAL: { bg: '#fee2e2', text: '#991b1b', border: '#f87171' },
  WARNING: { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
};

// Demo exceptions
export const DEMO_EXCEPTIONS: Exception[] = [
  {
    id: 'E001', type: 'PRICE_MISSING', severity: 'CRITICAL', fundId: 'F004', fundName: 'Acme European Growth',
    description: 'AAPL - Stale price >24h', detail: 'Last price: $178.32 from 2026-05-09 16:00 EST. Threshold: 4 hours.',
    timestamp: '14:32:05', actions: [{ label: 'Override Price', action: 'override' }, { label: 'Request Price', action: 'request' }],
  },
  {
    id: 'E002', type: 'MAPPING_ERROR', severity: 'CRITICAL', fundId: 'F004', fundName: 'Acme European Growth',
    description: 'Unknown security: 8374921', detail: 'CUSIP 037833100 received from custodian feed. No mapping found in security master.',
    timestamp: '14:28:12', actions: [{ label: 'Map Security', action: 'map' }, { label: 'Escalate', action: 'escalate' }],
  },
  {
    id: 'E003', type: 'CORPORATE_ACTION', severity: 'WARNING', fundId: 'F001', fundName: 'Acme Global Equity Fund',
    description: 'TSLA 3:1 stock split effective today', detail: 'Split ratio: 3:1. Ex-date: 2026-05-10. Holdings will be adjusted post-settlement.',
    timestamp: '13:45:00', actions: [{ label: 'Process', action: 'process' }, { label: 'Review', action: 'review' }],
  },
  {
    id: 'E004', type: 'VALIDATION_FAILED', severity: 'WARNING', fundId: 'F006', fundName: 'Acme Multi-Strategy',
    description: 'NAV variance: +0.42%', detail: 'Calculated NAV ($14.2356) exceeds yesterday ($14.1761) by +0.42%. Tolerance: +/-0.30%',
    timestamp: '12:15:33', actions: [{ label: 'Approve', action: 'approve' }, { label: 'Recalculate', action: 'recalc' }],
  },
  {
    id: 'E005', type: 'CASH_BREAK', severity: 'CRITICAL', fundId: 'F002', fundName: 'Acme Emerging Markets',
    description: 'Cash reconciliation break: $1,247.50', detail: 'Custodian cash: $12,450,200.50 | Internal: $12,448,953.00 | Difference: $1,247.50',
    timestamp: '11:00:00', actions: [{ label: 'Investigate', action: 'investigate' }, { label: 'Post Adjustment', action: 'adjust' }],
  },
];

interface ExceptionPanelProps {
  open: boolean;
  onClose: () => void;
}

const ExceptionPanel = ({ open, onClose }: ExceptionPanelProps) => {
  const [exceptions] = useState<Exception[]>(DEMO_EXCEPTIONS);

  const criticalCount = exceptions.filter(e => e.severity === 'CRITICAL').length;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight={600}>
              Exceptions Requiring Action
            </Typography>
          </Box>
          <Button size="small" onClick={onClose} sx={{ minWidth: 0, p: 0.5 }}>
            <CloseIcon />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${criticalCount} Critical`}
            size="small"
            sx={{ bgcolor: SEVERITY_COLORS.CRITICAL.bg, color: SEVERITY_COLORS.CRITICAL.text, border: `1px solid ${SEVERITY_COLORS.CRITICAL.border}`, fontWeight: 600, fontSize: '0.7rem' }}
          />
          <Chip
            label={`${exceptions.length - criticalCount} Warning`}
            size="small"
            sx={{ bgcolor: SEVERITY_COLORS.WARNING.bg, color: SEVERITY_COLORS.WARNING.text, border: `1px solid ${SEVERITY_COLORS.WARNING.border}`, fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ py: 0 }}>
          {exceptions.map((exception, index) => {
            const Icon = EXCEPTION_ICONS[exception.type] || WarningIcon;
            const sev = SEVERITY_COLORS[exception.severity];
            return (
              <Box key={exception.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'stretch' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                    <Box sx={{
                      p: 0.75, borderRadius: 1.5, bgcolor: alpha(sev.border, 0.1),
                      color: sev.text, mt: 0.25,
                    }}>
                      <Icon fontSize="small" />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ color: sev.text }}>
                          {exception.description}
                        </Typography>
                        <Chip
                          label={exception.severity}
                          size="small"
                          sx={{ bgcolor: sev.bg, color: sev.text, border: `1px solid ${sev.border}`, fontSize: '0.65rem', height: 20, fontWeight: 700, ml: 1 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {exception.fundName} · {exception.timestamp}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                        {exception.detail}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {exception.actions.map((action) => (
                          <Button
                            key={action.action}
                            variant={action.action === 'approve' ? 'contained' : 'outlined'}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              py: 0.5,
                              px: 1.5,
                              ...(action.action === 'approve' ? {} : {
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
                              }),
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default ExceptionPanel;
