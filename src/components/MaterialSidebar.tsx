import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Collapse, alpha, useTheme, Divider, Badge,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Calculate as CalculateIcon,
  FolderOpen as PortfolioIcon,
  AccountTree as WorkflowIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandMore, ExpandLess,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useIntl } from "react-intl";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: "permanent" | "persistent" | "temporary";
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    defaultOpen: true,
    items: [
      { id: "dashboard", name: "Operational Cockpit", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
    ],
  },
  {
    title: "NAV & Valuation",
    defaultOpen: true,
    items: [
      { id: "nav-calc", name: "NAV Calculator", icon: <CalculateIcon fontSize="small" />, path: "/nav-calculation", badge: 2 },
      { id: "price-val", name: "Price Validation", icon: <AnalyticsIcon fontSize="small" />, path: "/workflows" },
      { id: "exceptions", name: "Exceptions", icon: <WarningIcon fontSize="small" />, path: "/workflows", badge: 5 },
      { id: "nav-approval", name: "NAV Approval", icon: <DashboardIcon fontSize="small" />, path: "/results" },
    ],
  },
  {
    title: "Portfolios",
    defaultOpen: false,
    items: [
      { id: "portfolios", name: "Holdings", icon: <PortfolioIcon fontSize="small" />, path: "/portfolios" },
      { id: "transactions", name: "Transactions", icon: <AnalyticsIcon fontSize="small" />, path: "/front-office" },
      { id: "cash-positions", name: "Cash & Positions", icon: <PortfolioIcon fontSize="small" />, path: "/middle-office" },
      { id: "corp-actions", name: "Corporate Actions", icon: <AnalyticsIcon fontSize="small" />, path: "/back-office" },
    ],
  },
  {
    title: "Data & Workflows",
    defaultOpen: false,
    items: [
      { id: "workflow-monitor", name: "Workflow Monitor", icon: <WorkflowIcon fontSize="small" />, path: "/data" },
      { id: "data-feeds", name: "Data Feeds", icon: <AnalyticsIcon fontSize="small" />, path: "/search" },
      { id: "calc-engine", name: "Calculation Engine", icon: <CalculateIcon fontSize="small" />, path: "/workflow-config" },
    ],
  },
  {
    title: "Reporting",
    defaultOpen: false,
    items: [
      { id: "std-reports", name: "Standard Reports", icon: <AnalyticsIcon fontSize="small" />, path: "/knowledge-base" },
      { id: "reg-filings", name: "Regulatory Filings", icon: <PortfolioIcon fontSize="small" />, path: "/knowledge-graph" },
      { id: "custom-queries", name: "Custom Queries", icon: <AnalyticsIcon fontSize="small" />, path: "/platform-config" },
    ],
  },
  {
    title: "Administration",
    defaultOpen: false,
    items: [
      { id: "agents", name: "Automation Agents", icon: <WorkflowIcon fontSize="small" />, path: "/agents" },
      { id: "about", name: "About / Help", icon: <SettingsIcon fontSize="small" />, path: "/about" },
    ],
  },
];

const NavSectionComponent = ({ section }: { section: NavSection }) => {
  const [open, setOpen] = useState(section.defaultOpen ?? false);
  const theme = useTheme();
  const location = useLocation();
  const hasActiveItem = section.items.some(item => location.pathname === item.path);
  const isOpen = open || hasActiveItem;

  return (
    <Box sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={() => setOpen(!isOpen)}
        sx={{ py: 0.75, px: 2, borderRadius: 0, '&:hover': { bgcolor: 'transparent' } }}
      >
        <ListItemText
          primary={section.title}
          primaryTypographyProps={{
            variant: 'subtitle2',
            sx: { color: 'text.secondary', fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }
          }}
        />
        {isOpen ? <ExpandLess sx={{ fontSize: 16, color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: 16, color: 'text.secondary' }} />}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {section.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.id} disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    py: 0.75, borderRadius: 1.5,
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: isActive ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? 'text.primary' : 'text.secondary',
                    }}
                  />
                  {item.badge && item.badge > 0 && (
                    <Box
                      sx={{
                        minWidth: 18, height: 18, borderRadius: '50%',
                        bgcolor: 'error.main', color: 'error.contrastText',
                        fontSize: '0.65rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ml: 0.5,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

const MaterialSidebar = ({ open, onClose, variant }: SidebarProps) => {
  const intl = useIntl();
  const drawerWidth = 260;

  return (
    <Drawer
      variant={variant} open={open} onClose={onClose}
      sx={{
        width: drawerWidth, flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth, boxSizing: 'border-box',
          borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.default',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 9, pb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flex: 1 }}>
          {navSections.map((section) => (
            <NavSectionComponent key={section.title} section={section} />
          ))}
        </List>
        <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Otomeshon Custodian Platform v2.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MaterialSidebar;
