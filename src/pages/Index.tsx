import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);
  return <DashboardSkeleton />;
};

export default Index;
