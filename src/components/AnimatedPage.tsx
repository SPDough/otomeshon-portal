// Minimal page wrapper - finance users prefer instant screen draws
// Framer motion animations are removed to reduce perceived latency
import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface AnimatedPageProps {
  children: ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
  return (
    <Box sx={{ outline: 'none' }}>
      {children}
    </Box>
  );
};

// Kept for backward compatibility with existing pages
export const fadeInUp = {};
export const staggerContainer = {};

export default AnimatedPage;
