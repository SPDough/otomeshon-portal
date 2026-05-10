import { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, CardHeader, Button, Stepper, Step, StepLabel,
  Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, Chip, alpha,
  StepConnector, stepConnectorClasses, Tooltip,
} from '@mui/material';
import {
  CheckCircle, Error, Warning, PlayArrow, Pause, Refresh,
  TrendingUp as PriceIcon, Settings as ConfigIcon,
} from '@mui/icons-material';
import StatusChip from '@/components/StatusChip';
import { formatCurrency, formatPrice, formatPercentage, tabularNums } from '@/lib/finance';
import { useFund } from '@/contexts/FundContext';

const steps = [
  'Pre-Calculation Checks',
  'Data Collection',
  'Position Valuation',
  'GAV Calculation',
  'Expense Accrual',
  'NAV Computation',
  'Validation & Approval',
];

interface Position {
  security: string;
  isin: string;
  quantity: number;
  price: number;
  marketValue: number;
  pnl: number;
  status: 'PRICED' | 'STALE' | 'MISSING' | 'OVERRIDE' | 'HOLIDAY';
}

const positions: Position[] = [
  { security: 'Apple Inc', isin: 'US0378331005', quantity: 45200, price: 178.32, marketValue: 8060064.00, pnl: 124500.00, status: 'PRICED' },
  { security: 'Microsoft Corp', isin: 'US5949181045', quantity: 32100, price: 412.56, marketValue: 13243176.00, pnl: -23400.00, status: 'PRICED' },
  { security: 'Tesla Inc', isin: 'US88160R1014', quantity: 28900, price: 172.50, marketValue: 4985250.00, pnl: 89000.00, status: 'OVERRIDE' },
  { security: 'NVIDIA Corp', isin: 'US67066G1040', quantity: 18400, price: 924.75, marketValue: 17015400.00, pnl: 456700.00, status: 'PRICED' },
  { security: 'Amazon.com', isin: 'US0231351067', quantity: 56700, price: 187.20, marketValue: 10614240.00, pnl: 78900.00, status: 'PRICED' },
  { security: 'SoftBank Group', isin: 'JP3436100006', quantity: 45000, price: 0, marketValue: 0, pnl: 0, status: 'HOLIDAY' },
  { security: 'Alphabet Inc', isin: 'US02079K1079', quantity: 28300, price: 156.80, marketValue: 4437440.00, pnl: -12300.00, status: 'PRICED' },
];

const CustomConnector = () => (
  <StepConnector sx={{
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'divider',
    },
  }} />
);

const NavCalculation = () => {
  const { selectedFund } = useFund();
  const [activeStep, setActiveStep] = useState(2);
  const [isRunning, setIsRunning] = useState(true);

  const totalPositions = 1204;
  const pricedPositions = 847;
  const exceptionPositions = positions.filter(p => p.status !== 'PRICED').length;
  const totalMarketValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  const statusSummary = [
    { label: 'Priced', count: pricedPositions, color: '#16a34a' },
    { label: 'Exceptions', count: 3, color: '#dc2626' },
    { label: 'Override', count: 1, color: '#d97706' },
    { label: 'Holiday', count: 1, color: '#64748b' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
          NAV Calculation
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {selectedFund?.name || 'Select a fund'} · 10-May-2026
          </Typography>
          <Chip
            label={`${pricedPositions} / ${totalPositions} priced`}
            size="small"
            sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600, fontSize: '0.7rem', height: 22 }}
          />
          {exceptionPositions > 0 && (
            <Chip
              label={`${exceptionPositions} need attention`}
              size="small"
              sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 600, fontSize: '0.7rem', height: 22 }}
            />
          )}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            {isRunning ? (
              <Button variant="contained" size="small" startIcon={<Pause />} onClick={() => setIsRunning(false)} color="warning"
                sx={{ fontSize: '0.8rem' }}>
                Pause
              </Button>
            ) : (
              <Button variant="contained" size="small" startIcon={<PlayArrow />} onClick={() => setIsRunning(true)}
                sx={{ fontSize: '0.8rem' }}>
                Resume
              </Button>
            )}
            <Button variant="outlined" size="small" startIcon={<Refresh />} sx={{ fontSize: '0.8rem' }}>
              Restart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3, borderRadius: 2, p: 2 }}>
        <Stepper activeStep={activeStep} connector={<CustomConnector />} alternativeLabel>
          {steps.map((label, index) => {
            const isCompleted = index < activeStep;
            const isCurrent = index === activeStep;
            return (
              <Step key={label} completed={isCompleted}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '& .MuiStepIcon-root': {
                        color: isCompleted ? 'success.main' : isCurrent ? 'primary.main' : 'text.disabled',
                        '&.Mui-active': { color: 'primary.main' },
                        '&.Mui-completed': { color: 'success.main' },
                      }
                    }
                  }}
                >
                  <Typography variant="caption" fontWeight={isCurrent ? 600 : 400} color={isCurrent ? 'text.primary' : 'text.secondary'}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Card>

      {/* Current Step Detail */}
      <Card sx={{ mb: 3, borderRadius: 2, borderColor: 'primary.main', border: '1px solid' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfigIcon fontSize="small" color="primary" />
                Step 3: Position Valuation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pricedPositions} of {totalPositions} positions priced · {exceptionPositions} require attention
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {formatCurrency(totalMarketValue, 'USD', 0)}
              </Typography>
              <Typography variant="caption" color={totalPnl >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl, 'USD', 0)} day
              </Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(pricedPositions / totalPositions) * 100}
            sx={{
              height: 8, borderRadius: 4, mb: 3,
              bgcolor: (t) => alpha(t.palette.divider, 0.3),
              '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
            }}
          />

          {/* Status Summary Chips */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 0 }}>
            {statusSummary.map((s) => (
              <Chip
                key={s.label}
                label={`${s.count} ${s.label}`}
                size="small"
                sx={{ bgcolor: alpha(s.color, 0.1), color: s.color, fontWeight: 600, fontSize: '0.7rem', height: 24 }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader
          title={<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Position Details</Typography>}
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0, px: 0, pb: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.04) }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', pl: 3, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary' }}>Security</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary' }}>ISIN</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'right' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'right' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'right' }}>Market Value</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'right' }}>P&L</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', pr: 3, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((pos, i) => (
                <TableRow key={i} hover sx={{
                  '&:last-child td': { borderBottom: 0 },
                  bgcolor: pos.status !== 'PRICED' ? alpha('#fee2e2', 0.15) : 'inherit',
                }}>
                  <TableCell sx={{ pl: 3, py: 1.5 }}>
                    <Typography variant="body2" fontWeight={500}>{pos.security}</Typography>
                  </TableCell>
                  <TableCell sx={{ ...tabularNums, color: 'text.secondary', fontSize: '0.8rem' }}>{pos.isin}</TableCell>
                  <TableCell align="right" sx={{ ...tabularNums }}>{pos.quantity.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ ...tabularNums }}>
                    {pos.price > 0 ? formatPrice(pos.price) : '--'}
                  </TableCell>
                  <TableCell align="right" sx={{ ...tabularNums, fontWeight: 500 }}>
                    {pos.marketValue > 0 ? formatCurrency(pos.marketValue) : '--'}
                  </TableCell>
                  <TableCell align="right" sx={{
                    ...tabularNums,
                    color: pos.pnl > 0 ? 'success.main' : pos.pnl < 0 ? 'error.main' : 'text.secondary',
                    fontWeight: pos.pnl !== 0 ? 500 : 400,
                  }}>
                    {pos.pnl !== 0 ? `${pos.pnl > 0 ? '+' : ''}${formatCurrency(pos.pnl)}` : '--'}
                  </TableCell>
                  <TableCell align="center">
                    {pos.status === 'PRICED' && <StatusChip status="COMPLETED" />}
                    {pos.status === 'STALE' && <StatusChip status="EXCEPTION" />}
                    {pos.status === 'MISSING' && <StatusChip status="AWAITING_PRICE" />}
                    {pos.status === 'OVERRIDE' && <StatusChip status="MANUAL_OVERRIDE" />}
                    {pos.status === 'HOLIDAY' && <StatusChip status="PENDING" />}
                  </TableCell>
                  <TableCell align="center" sx={{ pr: 3 }}>
                    {pos.status !== 'PRICED' && (
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {pos.status === 'STALE' && (
                          <>
                            <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0.25, px: 1, minWidth: 0 }}>Override</Button>
                            <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0.25, px: 1, minWidth: 0 }}>Hold</Button>
                          </>
                        )}
                        {pos.status === 'HOLIDAY' && (
                          <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0.25, px: 1, minWidth: 0 }}>Skip</Button>
                        )}
                        {pos.status === 'OVERRIDE' && (
                          <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0.25, px: 1, minWidth: 0 }}>Review</Button>
                        )}
                      </Box>
                    )}
                    {pos.status === 'PRICED' && (
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        <CheckCircle sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                        OK
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NavCalculation;
