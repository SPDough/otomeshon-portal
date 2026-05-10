import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Card, CardContent, Button,
  Table, TableBody, TableCell, TableHead, TableRow, LinearProgress,
  Chip, alpha, Divider, Tooltip,
} from "@mui/material";
import {
  TrendingUp, TrendingDown, CheckCircle, KeyboardArrowRight,
  Analytics, Storage, Search, AccountTree,
} from "@mui/icons-material";
import StatusChip, { TrendIndicator, DoneIndicator } from "@/components/StatusChip";
import { rowStatusTints } from "@/theme";
import { formatCurrency, formatTimeAgo, tabularNums } from "@/lib/finance";

// Demo data with yesterday's NAV for trend comparison
const navStatusData = [
  { fund: 'Acme Global Equity Fund', currency: 'USD', status: 'IN_PROGRESS', progress: 72, positions: '847 / 1,204', gav: 1247500230.45, navPerShare: 14.2356, navPerShareYest: 14.1761, timeRemaining: 45 },
  { fund: 'Acme Emerging Markets', currency: 'USD', status: 'PENDING', progress: 0, positions: '0 / 3,891', gav: 0, navPerShare: 0, navPerShareYest: 0, timeRemaining: 120 },
  { fund: 'Acme Fixed Income Plus', currency: 'EUR', status: 'COMPLETED', progress: 100, positions: '2,104 / 2,104', gav: 892341567.22, navPerShare: 102.4532, navPerShareYest: 102.4105, timeRemaining: 0 },
  { fund: 'Acme European Growth', currency: 'EUR', status: 'EXCEPTION', progress: 58, positions: '412 / 708', gav: 456789123.00, navPerShare: 0, navPerShareYest: 28.3412, timeRemaining: 75 },
  { fund: 'Acme Multi-Strategy', currency: 'GBP', status: 'IN_PROGRESS', progress: 91, positions: '1,567 / 1,720', gav: 678901234.56, navPerShare: 8.9123, navPerShareYest: 8.8901, timeRemaining: 20 },
];

const workQueue = [
  { task: 'Approve NAV - Acme Fixed Income Plus', type: 'APPROVAL', fund: 'F003', priority: 'HIGH', age: 12 },
  { task: 'Override price: AAPL (Acme European Growth)', type: 'OVERRIDE', fund: 'F004', priority: 'CRITICAL', age: 3 },
  { task: 'Map unknown security: 8374921', type: 'MAPPING', fund: 'F004', priority: 'CRITICAL', age: 8 },
  { task: 'Review corporate action: TSLA 3:1 split', type: 'REVIEW', fund: 'F001', priority: 'MEDIUM', age: 25 },
  { task: 'Cash reconciliation break: $1,247.50', type: 'RECONCILE', fund: 'F002', priority: 'HIGH', age: 45 },
];

// Timeline steps with horizontal step bar
const timelineSteps = [
  { label: 'Pre-Checks', completed: true, time: '13:30:00', detail: 'All checks passed' },
  { label: 'Data Coll.', completed: true, time: '13:45:22', detail: 'Prices: 1,201/1,204' },
  { label: 'Valuation', completed: false, active: true, time: '14:15:10', detail: '847 of 1,204 priced' },
  { label: 'GAV', completed: false, active: false, time: '--', detail: '--' },
  { label: 'Expenses', completed: false, active: false, time: '--', detail: '--' },
  { label: 'NAV', completed: false, active: false, time: '--', detail: '--' },
  { label: 'Approval', completed: false, active: false, time: '--', detail: '--' },
];

const priorityColors: Record<string, string> = {
  CRITICAL: '#dc2626',
  HIGH: '#d97706',
  MEDIUM: '#2563eb',
  LOW: '#64748b',
};

// Modern table header style
const thStyle = {
  fontWeight: 600,
  fontSize: '0.6875rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#94a3b8',
};

const Dashboard = () => {
  const navigate = useNavigate();

  const completedFunds = navStatusData.filter(f => f.status === 'COMPLETED').length;
  const inProgressFunds = navStatusData.filter(f => f.status === 'IN_PROGRESS').length;
  const exceptionFunds = navStatusData.filter(f => f.status === 'EXCEPTION').length;
  const pendingFunds = navStatusData.filter(f => f.status === 'PENDING').length;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header — modern, dramatic hierarchy */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            mb: 1,
          }}
        >
          Operational Cockpit
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            10-May-2026 · NAV Cycle Status
          </Typography>
          <StatusSummary label={`${completedFunds} Completed`} color="#16a34a" />
          <StatusSummary label={`${inProgressFunds} In Progress`} color="#2563eb" />
          {exceptionFunds > 0 && (
            <StatusSummary label={`${exceptionFunds} Exception`} color="#dc2626" />
          )}
          {pendingFunds > 0 && (
            <StatusSummary label={`${pendingFunds} Pending`} color="#d97706" />
          )}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              SLA: 4:30 PM GMT · 2h 18m remaining
            </Typography>
            <Button variant="contained" size="small" onClick={() => navigate('/nav-calculation')}
              sx={{ fontSize: '0.8125rem', px: 2, py: 0.5, fontWeight: 500 }}>
              NAV Calculator
            </Button>
          </Box>
        </Box>
      </Box>

      {/* NAV Status Table — borderless card, contextual row coloring */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h3" sx={{ fontSize: '0.9375rem', fontWeight: 600 }}>NAV Status Board</Typography>
            <Button size="small" endIcon={<KeyboardArrowRight sx={{ fontSize: 16 }} />}
              onClick={() => navigate('/nav-calculation')} sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              View All
            </Button>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...thStyle, pl: 3 }}>Fund</TableCell>
                <TableCell sx={thStyle}>Status</TableCell>
                <TableCell sx={thStyle}>Progress</TableCell>
                <TableCell sx={{ ...thStyle, textAlign: 'right' }}>Positions</TableCell>
                <TableCell sx={{ ...thStyle, textAlign: 'right' }}>GAV</TableCell>
                <TableCell sx={{ ...thStyle, textAlign: 'right' }}>NAV/Share</TableCell>
                <TableCell sx={{ ...thStyle, textAlign: 'right', pr: 3 }}>ETA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {navStatusData.map((fund, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    bgcolor: rowStatusTints[fund.status] || 'transparent',
                    borderLeft: fund.status === 'EXCEPTION' ? '3px solid #dc2626' : fund.status === 'IN_PROGRESS' ? '3px solid #2563eb' : '3px solid transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ pl: 3, py: 1.5 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8125rem' }}>{fund.fund}</Typography>
                    <Typography variant="caption" color="text.secondary">{fund.currency}</Typography>
                  </TableCell>
                  <TableCell><StatusChip status={fund.status} /></TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={fund.progress}
                        sx={{
                          height: 5,
                          borderRadius: 2.5,
                          flex: 1,
                          bgcolor: (t) => alpha(t.palette.divider, 0.3),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: fund.status === 'EXCEPTION' ? '#dc2626' : fund.status === 'COMPLETED' ? '#16a34a' : '#2563eb',
                            borderRadius: 2.5,
                          }
                        }} />
                      <Typography variant="caption" sx={{ ...tabularNums, minWidth: 28, textAlign: 'right', fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
                        {fund.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ ...tabularNums, fontSize: '0.8125rem' }}>{fund.positions}</TableCell>
                  <TableCell align="right" sx={{ ...tabularNums, fontWeight: 500, fontSize: '0.8125rem' }}>
                    {fund.gav > 0 ? formatCurrency(fund.gav, fund.currency, 0) : '—'}
                  </TableCell>
                  <TableCell align="right">
                    {fund.navPerShare > 0 ? (
                      <Box>
                        <Typography sx={{ ...tabularNums, fontWeight: 500, fontSize: '0.8125rem' }}>
                          {formatCurrency(fund.navPerShare, fund.currency, 4)}
                        </Typography>
                        <TrendIndicator current={fund.navPerShare} previous={fund.navPerShareYest} />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3, ...tabularNums }}>
                    {fund.timeRemaining > 0 ? (
                      <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                        ~{fund.timeRemaining}m
                      </Typography>
                    ) : (
                      <DoneIndicator />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* Work Queue */}
        <Card>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h3" sx={{ fontSize: '0.9375rem', fontWeight: 600 }}>My Work Queue</Typography>
              <Button size="small" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>View All</Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...thStyle, pl: 3 }}>Task</TableCell>
                  <TableCell sx={thStyle}>Priority</TableCell>
                  <TableCell sx={{ ...thStyle, textAlign: 'right', pr: 3 }}>Age</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workQueue.map((task, i) => (
                  <TableRow key={i} hover sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ pl: 3, py: 1.5 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                        {task.task}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{task.type}</Typography>
                    </TableCell>
                    <TableCell>
                      <PriorityDot priority={task.priority} />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3, ...tabularNums, fontSize: '0.8125rem', color: task.age > 30 ? '#d97706' : 'text.secondary', fontWeight: task.age > 30 ? 600 : 400 }}>
                      {formatTimeAgo(task.age)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Processing Timeline with Step Bar */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ fontSize: '0.9375rem', fontWeight: 600, mb: 0.5 }}>Processing Timeline</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
              Acme Global Equity Fund · 10-May-2026
            </Typography>

            {/* Horizontal Step Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3, px: 0.5 }}>
              {timelineSteps.map((step, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0.5 }}>
                  {i > 0 && (
                    <Box sx={{
                      flex: 1,
                      height: 2,
                      borderRadius: 1,
                      bgcolor: step.completed ? '#16a34a' : '#e2e8f0',
                      transition: 'background-color 0.3s ease',
                      minWidth: 8,
                    }} />
                  )}
                  <Box sx={{
                    width: step.active ? 20 : step.completed ? 16 : 12,
                    height: step.active ? 20 : step.completed ? 16 : 12,
                    borderRadius: '50%',
                    bgcolor: step.completed ? '#16a34a' : step.active ? '#2563eb' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.completed || step.active ? '#fff' : '#94a3b8',
                    fontSize: step.active ? '0.625rem' : '0.5rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    ...(step.active && {
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                    }),
                  }}>
                    {step.completed ? (
                      <CheckCircle sx={{ fontSize: step.active ? 14 : 12 }} />
                    ) : (
                      i + 1
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Step Labels Row */}
            <Box sx={{ display: 'flex', gap: 0.5, px: 0.5, mb: 2 }}>
              {timelineSteps.map((step, i) => (
                <Box key={i} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.625rem',
                      fontWeight: step.active ? 600 : step.completed ? 500 : 400,
                      color: step.active ? 'primary.main' : step.completed ? '#16a34a' : '#94a3b8',
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Detail List */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {timelineSteps.map((step, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1,
                    pl: 2,
                    borderLeft: '2px solid',
                    borderColor: step.completed ? '#16a34a' : step.active ? '#2563eb' : '#e2e8f0',
                    ml: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ ...tabularNums, minWidth: 56, fontSize: '0.6875rem' }}>
                    {step.time}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: step.active ? 600 : 400,
                      color: step.active ? 'text.primary' : step.completed ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography variant="caption" sx={{
                    ml: 'auto',
                    fontSize: '0.6875rem',
                    color: step.active ? 'primary.main' : step.completed ? '#16a34a' : 'text.secondary',
                    fontWeight: step.active ? 500 : 400,
                  }}>
                    {step.completed && '✓ '}
                    {step.active && '▸ '}
                    {step.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Access */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h3" sx={{ fontSize: '0.9375rem', fontWeight: 600, mb: 1.5 }}>
          Quick Access
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
          {[
            { title: 'Price Validation', desc: 'Review stale prices', icon: <Analytics />, path: '/workflows' },
            { title: 'Data Feeds', desc: 'Monitor data sources', icon: <Storage />, path: '/data' },
            { title: 'Search Platform', desc: 'Find securities, funds', icon: <Search />, path: '/search' },
            { title: 'Workflow Config', desc: 'Manage calculations', icon: <AccountTree />, path: '/workflow-config' },
          ].map((action) => (
            <Card
              key={action.title}
              sx={{
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease, border-color 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ py: 2.5, px: 2 }}>
                <Box sx={{ color: 'primary.main', mb: 1, opacity: 0.8 }}>{action.icon}</Box>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>{action.title}</Typography>
                <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

// Modern status summary — small dot + muted label
const StatusSummary = ({ label, color }: { label: string; color: string }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.375, borderRadius: 1, bgcolor: alpha(color, 0.06) }}>
    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
    <Typography variant="caption" sx={{ fontWeight: 600, color, fontSize: '0.6875rem' }}>{label}</Typography>
  </Box>
);

// Priority dot — modern dot+label
const PriorityDot = ({ priority }: { priority: string }) => {
  const color = priorityColors[priority] || '#64748b';
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, color }}>{priority}</Typography>
    </Box>
  );
};

export default Dashboard;
