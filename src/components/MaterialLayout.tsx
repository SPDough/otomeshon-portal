import { useState } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme, Toolbar } from "@mui/material";
import MaterialNavbar from "./MaterialNavbar";
import MaterialSidebar from "./MaterialSidebar";

interface MaterialLayoutProps {
  children: React.ReactNode;
}

const MaterialLayout = ({ children }: MaterialLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const drawerWidth = 260;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      <MaterialNavbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      <MaterialSidebar 
        open={sidebarOpen} 
        onClose={toggleSidebar}
        variant={isMobile ? "temporary" : "persistent"}
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 },
          marginLeft: !isMobile && sidebarOpen ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MaterialLayout;
