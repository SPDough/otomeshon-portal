import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { motion } from "framer-motion";
import { Container, Typography, Box, Card, CardContent, alpha, Chip, LinearProgress, useTheme } from "@mui/material";
import { Shield as ShieldIcon, PlayArrow as AutomationIcon, AccountTree as WorkflowIcon, Schedule as ScheduleIcon, Analytics as AnalyticsIcon, ArrowForward } from "@mui/icons-material";
import AnimatedPage, { fadeInUp, staggerContainer } from "@/components/AnimatedPage";
import AppBreadcrumb from "@/components/AppBreadcrumb";

const MiddleOffice = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const intl = useIntl();
  const fm = (id: string) => intl.formatMessage({ id });

  const features = [
    { title: fm("middleOffice.riskManagement"), description: fm("middleOffice.riskManagementDesc"), icon: <ShieldIcon />, path: "/reconciliation", stats: fm("middleOffice.riskManagementStats"), color: theme.palette.success.main },
    { title: fm("middleOffice.automationRules"), description: fm("middleOffice.automationRulesDesc"), icon: <AutomationIcon />, path: "/reconciliation", stats: fm("middleOffice.automationRulesStats"), color: theme.palette.primary.main },
    { title: fm("middleOffice.processFlows"), description: fm("middleOffice.processFlowsDesc"), icon: <WorkflowIcon />, path: "/workflow-config", stats: fm("middleOffice.processFlowsStats"), color: theme.palette.info.main },
    { title: fm("middleOffice.scheduledTasks"), description: fm("middleOffice.scheduledTasksDesc"), icon: <ScheduleIcon />, path: "/workflow-config", stats: fm("middleOffice.scheduledTasksStats"), color: theme.palette.warning.main },
    { title: fm("middleOffice.analytics"), description: fm("middleOffice.analyticsDesc"), icon: <AnalyticsIcon />, path: "/results", stats: fm("middleOffice.analyticsStats"), color: theme.palette.secondary.main },
  ];

  const activeProcesses = [
    { name: fm("middleOffice.dailyReconciliation"), progress: 78, status: "running" },
    { name: fm("middleOffice.riskAssessment"), progress: 100, status: "complete" },
    { name: fm("middleOffice.navCalculation"), progress: 45, status: "running" },
  ];

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <AppBreadcrumb crumbs={[{ labelId: "breadcrumb.middleOffice" }]} />
        <motion.div variants={fadeInUp}>
          <Box sx={{ mb: 6 }}>
            <Chip label={fm("middleOffice.chip")} size="small" sx={{ mb: 2, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', fontWeight: 500 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 2 }}>{fm("middleOffice.title")}</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.6 }}>{fm("middleOffice.subtitle")}</Typography>
          </Box>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card sx={{ mb: 4, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>{fm("middleOffice.activeProcesses")}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {activeProcesses.map((process) => (
                  <Box key={process.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{process.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{process.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={process.progress} color={process.status === 'complete' ? 'success' : 'primary'} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card sx={{ height: '100%', cursor: 'pointer', position: 'relative', overflow: 'hidden', '&:hover': { boxShadow: `0 8px 30px ${alpha(feature.color, 0.15)}`, transform: 'translateY(-4px)', '& .arrow-icon': { transform: 'translateX(4px)', opacity: 1 } }, transition: 'all 0.3s ease' }} onClick={() => navigate(feature.path)}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: feature.color }} />
                  <CardContent sx={{ p: 3, pl: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: 2, bgcolor: alpha(feature.color, 0.1), color: feature.color }}>{feature.icon}</Box>
                      <Chip label={feature.stats} size="small" variant="outlined" sx={{ borderColor: 'divider' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>{feature.description}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <Typography variant="body2" fontWeight={500}>{fm("middleOffice.configure")}</Typography>
                      <ArrowForward className="arrow-icon" sx={{ ml: 0.5, fontSize: 16, opacity: 0, transition: 'all 0.2s ease' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </AnimatedPage>
  );
};

export default MiddleOffice;