import { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem,
  Avatar, Chip, alpha, Select, FormControl, SelectChangeEvent, Tooltip,
  Popover, List, ListItem, ListItemText, ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon, Login as LoginIcon, Logout as LogoutIcon,
  Search as SearchIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon,
  Language as LanguageIcon, Warning as WarningIcon,
  ViewCompact as CompactIcon, ViewComfy as ComfortableIcon,
  KeyboardArrowDown, KeyboardArrowRight,
} from "@mui/icons-material";
import CommandPalette from "./CommandPalette";
import ExceptionPanel from "./ExceptionPanel";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFund } from "@/contexts/FundContext";
import { useIntl } from "react-intl";
import { useLocale, localeLabels } from "@/i18n/IntlContext";

interface MaterialNavbarProps {
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

// Fund context pill — modern rounded button with status dot
const FundPill = ({ fund, onClick }: { fund: { name: string; currency: string; status: string } | null; onClick: (e: React.MouseEvent) => void }) => {
  if (!fund) return null;
  const statusColor = fund.status === 'COMPLETED' ? '#16a34a' : fund.status === 'IN_PROGRESS' ? '#2563eb' : fund.status === 'EXCEPTION' ? '#dc2626' : '#d97706';
  return (
    <Button
      onClick={onClick}
      sx={{
        bgcolor: 'rgba(0,0,0,0.03)',
        borderRadius: 2,
        px: 1.5,
        py: 0.5,
        textTransform: 'none',
        color: 'text.primary',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
        transition: 'background-color 0.15s ease',
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor, flexShrink: 0 }} />
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
          {fund.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
          {fund.currency}
        </Typography>
        <KeyboardArrowDown sx={{ fontSize: 16, color: 'text.secondary', ml: -0.25 }} />
      </Box>
    </Button>
  );
};

const MaterialNavbar = ({ toggleSidebar, isMobile }: MaterialNavbarProps) => {
  const { user, signOut } = useAuth();
  const { selectedFund, funds, selectFundById } = useFund();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [fundAnchorEl, setFundAnchorEl] = useState<null | HTMLElement>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const { mode, toggleMode, density, toggleDensity } = useThemeMode();
  const { locale, setLocale } = useLocale();
  const intl = useIntl();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleFundChange = (id: string) => {
    selectFundById(id);
    setFundAnchorEl(null);
  };

  const pageTitle = useLocation().pathname === '/dashboard' ? 'Operational Cockpit'
    : useLocation().pathname === '/nav-calculation' ? 'NAV Calculation'
    : useLocation().pathname === '/portfolios' ? 'Portfolio Holdings'
    : useLocation().pathname === '/workflows' ? 'Workflow Monitor'
    : useLocation().pathname === '/results' ? 'NAV Approval'
    : useLocation().pathname === '/data' ? 'Data & Workflows'
    : '';

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ gap: 1, minHeight: 52, px: 2 }}>
          <IconButton
            onClick={toggleSidebar}
            sx={{ mr: 0.5, color: 'text.primary', '&:active': { transform: 'scale(0.92)' } }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Logo */}
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              color: "text.primary",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: '-0.03em',
              mr: 2,
              fontSize: '1.05rem',
            }}
          >
            Otomeshon
          </Typography>

          {!isMobile && (
            <>
              {/* Fund Context Pill */}
              {selectedFund && (
                <FundPill
                  fund={selectedFund}
                  onClick={(e) => setFundAnchorEl(e.currentTarget)}
                />
              )}
              <Popover
                open={Boolean(fundAnchorEl)}
                anchorEl={fundAnchorEl}
                onClose={() => setFundAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { minWidth: 280, mt: 0.5, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } }}
              >
                <List dense sx={{ py: 0.5 }}>
                  {funds.map((fund) => {
                    const sColor = fund.status === 'COMPLETED' ? '#16a34a' : fund.status === 'IN_PROGRESS' ? '#2563eb' : fund.status === 'EXCEPTION' ? '#dc2626' : '#d97706';
                    return (
                      <ListItem
                        key={fund.id}
                        onClick={() => handleFundChange(fund.id)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          mx: 0.5,
                          '&:hover': { bgcolor: 'action.hover' },
                          bgcolor: selectedFund?.id === fund.id ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: sColor }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={fund.name}
                          secondary={`${fund.currency} · NAV: ${fund.navDate}`}
                          primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: '0.6875rem' }}
                        />
                        {selectedFund?.id === fund.id && <KeyboardArrowRight sx={{ fontSize: 16, color: 'primary.main' }} />}
                      </ListItem>
                    );
                  })}
                </List>
              </Popover>

              {/* Page title */}
              {pageTitle && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2, fontWeight: 500, fontSize: '0.8125rem' }}>
                  {pageTitle}
                </Typography>
              )}

              <Box sx={{ flex: 1 }} />

              {/* Density Toggle */}
              <Tooltip title={density === 'compact' ? 'Comfortable view' : 'Compact view'}>
                <IconButton
                  onClick={toggleDensity}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, '&:active': { transform: 'scale(0.92)' } }}
                >
                  {density === 'compact' ? <ComfortableIcon sx={{ fontSize: 18 }} /> : <CompactIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>

              {/* Exception Badge */}
              <Tooltip title="5 exceptions requiring action">
                <IconButton
                  onClick={() => setExceptionOpen(true)}
                  sx={{
                    color: 'error.main',
                    position: 'relative',
                    '&:hover': { color: 'error.dark' },
                    '&:active': { transform: 'scale(0.92)' },
                  }}
                >
                  <WarningIcon sx={{ fontSize: 18 }} />
                  <Box sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    minWidth: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor: 'background.paper',
                  }}>
                    5
                  </Box>
                </IconButton>
              </Tooltip>

              {/* Theme Toggle */}
              <IconButton
                onClick={toggleMode}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, '&:active': { transform: 'scale(0.92)' } }}
              >
                {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
              </IconButton>

              {/* Language */}
              <IconButton
                onClick={(e) => setLangAnchorEl(e.currentTarget)}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, '&:active': { transform: 'scale(0.92)' } }}
              >
                <LanguageIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Menu
                anchorEl={langAnchorEl}
                open={Boolean(langAnchorEl)}
                onClose={() => setLangAnchorEl(null)}
                PaperProps={{ sx: { minWidth: 160, mt: 1, borderRadius: 2 } }}
              >
                {localeLabels.map((l) => (
                  <MenuItem
                    key={l.code}
                    selected={locale === l.code}
                    onClick={() => { setLocale(l.code); setLangAnchorEl(null); }}
                    sx={{ fontSize: '0.8125rem' }}
                  >
                    {l.flag}&nbsp;&nbsp;{l.label}
                  </MenuItem>
                ))}
              </Menu>

              {/* Search Shortcut */}
              <Chip
                icon={<SearchIcon sx={{ fontSize: 14 }} />}
                label="⌘K"
                size="small"
                variant="outlined"
                onClick={() => setCommandOpen(true)}
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  mr: 1.5,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
                  height: 26,
                }}
              />

              {/* User */}
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 600 }}>
                    {displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Button
                    size="small"
                    onClick={() => signOut().then(() => window.location.reload())}
                    sx={{ color: 'text.secondary', fontSize: '0.75rem', minWidth: 0, px: 0.75 }}
                    startIcon={<LogoutIcon sx={{ fontSize: 14 }} />}
                  >
                    {intl.formatMessage({ id: "nav.logout" })}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LoginIcon sx={{ fontSize: 16 }} />}
                  component={RouterLink}
                  to="/auth"
                  sx={{ px: 2, py: 0.4, fontSize: '0.75rem', fontWeight: 500 }}
                >
                  {intl.formatMessage({ id: "nav.login" })}
                </Button>
              )}
            </>
          )}

          {isMobile && (
            <>
              <Box sx={{ flex: 1 }} />
              <IconButton onClick={() => setExceptionOpen(true)} sx={{ color: 'error.main', position: 'relative' }}>
                <WarningIcon />
                <Box sx={{
                  position: 'absolute', top: 4, right: 4,
                  width: 12, height: 12, borderRadius: '50%',
                  bgcolor: 'error.main', border: '2px solid', borderColor: 'background.paper',
                }} />
              </IconButton>
              <IconButton onClick={toggleMode}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton onClick={() => setCommandOpen(true)}><SearchIcon /></IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <ExceptionPanel open={exceptionOpen} onClose={() => setExceptionOpen(false)} />
    </>
  );
};

export default MaterialNavbar;
