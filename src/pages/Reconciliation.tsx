import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AnimatedPage, { fadeInUp } from "@/components/AnimatedPage";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import BreakExplainPanel from "@/components/BreakExplainPanel";
import {
  getOversightSnapshot,
  listOversightRuns,
  runOversightSlice,
  runSampleCsvIngest,
} from "@/lib/oversightApi";
import type { OversightComparison } from "@/types/oversight";
import { motion } from "framer-motion";

const statusColor = (status: string) => {
  if (status === "matched") return "success";
  if (status === "break" || status === "mismatch") return "error";
  return "warning";
};

const Reconciliation = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [selectedRunId, setSelectedRunId] = useState<string | undefined>(undefined);

  const runsQuery = useQuery({
    queryKey: ["oversight-runs"],
    queryFn: () => listOversightRuns(10),
    retry: 1,
  });

  const snapshotQuery = useQuery({
    queryKey: ["oversight-snapshot", selectedRunId ?? "latest"],
    queryFn: () => getOversightSnapshot(selectedRunId),
    retry: 1,
  });

  const runMutation = useMutation({
    mutationFn: runOversightSlice,
    onSuccess: (data) => {
      setSelectedRunId(data.run_id);
      queryClient.setQueryData(["oversight-snapshot", data.run_id], data);
      queryClient.invalidateQueries({ queryKey: ["oversight-runs"] });
    },
  });

  const csvMutation = useMutation({
    mutationFn: runSampleCsvIngest,
    onSuccess: (data) => {
      setSelectedRunId(data.run_id);
      queryClient.setQueryData(["oversight-snapshot", data.run_id], data);
      queryClient.invalidateQueries({ queryKey: ["oversight-runs"] });
    },
  });

  const snapshot = snapshotQuery.data;
  const breaksById = useMemo(() => {
    const map = new Map<string, NonNullable<typeof snapshot>["breaks"][number]>();
    for (const item of snapshot?.breaks ?? []) {
      map.set(item.payload.break_id, item);
    }
    return map;
  }, [snapshot]);

  const error =
    (runMutation.error as Error | null)?.message ||
    (csvMutation.error as Error | null)?.message ||
    (snapshotQuery.error as Error | null)?.message ||
    (runsQuery.error as Error | null)?.message;

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <AppBreadcrumb
          crumbs={[
            { labelId: "breadcrumb.middleOffice", path: "/middle-office" },
            { labelId: "__literal:Position Reconciliation" },
          ]}
        />

        <motion.div variants={fadeInUp}>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Chip
                label="Custodian oversight"
                size="small"
                sx={{
                  mb: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: "info.main",
                  fontWeight: 500,
                }}
              />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                Position Reconciliation
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                OMS intent vs ABOR/custodian outcome from Vellum backend control
                objects — deterministic rules, durable run history, evidence for
                every expertise level.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  snapshotQuery.refetch();
                  runsQuery.refetch();
                }}
                disabled={snapshotQuery.isFetching}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => runMutation.mutate()}
                disabled={runMutation.isPending || csvMutation.isPending}
              >
                Run fixtures
              </Button>
              <Button
                variant="outlined"
                onClick={() => csvMutation.mutate()}
                disabled={runMutation.isPending || csvMutation.isPending}
              >
                Run sample CSV
              </Button>
            </Stack>
          </Box>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}. Ensure Vellum is running at{" "}
            {import.meta.env.VITE_API_URL ?? "http://localhost:8000"}, migration 006
            is applied, and CORS allows this origin.
          </Alert>
        )}

        {(runsQuery.data?.length ?? 0) > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Run history
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>When</TableCell>
                    <TableCell>Run</TableCell>
                    <TableCell align="right">Breaks</TableCell>
                    <TableCell align="right">Matched</TableCell>
                    <TableCell>Rule</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {runsQuery.data?.map((run) => {
                    const active =
                      (selectedRunId ?? snapshot?.run_id) === run.run_id;
                    return (
                      <TableRow
                        key={run.run_id}
                        hover
                        selected={active}
                        sx={{ cursor: "pointer" }}
                        onClick={() => setSelectedRunId(run.run_id)}
                      >
                        <TableCell>
                          {new Date(run.ran_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{run.run_id.slice(0, 8)}</TableCell>
                        <TableCell align="right">
                          {run.summary?.breaks ?? "—"}
                        </TableCell>
                        <TableCell align="right">
                          {run.summary?.matched ?? "—"}
                        </TableCell>
                        <TableCell>
                          {(run.rule_family || run.summary?.rule_family || "")
                            .split(".")
                            .slice(-1)[0] || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {snapshot && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                gap: 2,
                mb: 3,
              }}
            >
              {[
                { label: "Pairs", value: snapshot.summary.position_pairs },
                { label: "Matched", value: snapshot.summary.matched },
                { label: "Breaks", value: snapshot.summary.breaks },
                { label: "Rule", value: snapshot.summary.rule_family.split(".").slice(-1)[0] },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Run {snapshot.run_id.slice(0, 8)} · {new Date(snapshot.ran_at).toLocaleString()}
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Comparisons
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Account</TableCell>
                      <TableCell>Security</TableCell>
                      <TableCell align="right">OMS</TableCell>
                      <TableCell align="right">ABOR</TableCell>
                      <TableCell align="right">|Δ|</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {snapshot.comparisons.map((row: OversightComparison) => (
                      <TableRow key={`${row.account_id}:${row.security_id}`} hover>
                        <TableCell>{row.account_id}</TableCell>
                        <TableCell>{row.security_id}</TableCell>
                        <TableCell align="right">{row.oms_quantity ?? "—"}</TableCell>
                        <TableCell align="right">{row.abor_quantity ?? "—"}</TableCell>
                        <TableCell align="right">
                          {row.absolute_quantity_difference ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.status}
                            color={statusColor(row.status)}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Breaks & evidence
                </Typography>
                {snapshot.breaks.length === 0 ? (
                  <Typography color="text.secondary">No open breaks.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {snapshot.breaks.map((item) => {
                      const comparison = snapshot.comparisons.find(
                        (c) =>
                          c.break_id === item.payload.break_id ||
                          (c.break_ids || []).includes(item.payload.break_id),
                      );
                      const breakDoc = breaksById.get(item.payload.break_id);
                      return (
                        <BreakExplainPanel
                          key={item.payload.break_id}
                          breakId={item.payload.break_id}
                          accountId={item.payload.account_id}
                          securityId={comparison?.security_id}
                          reasonCode={item.payload.reason_code}
                          fallbackExplanation={
                            item.payload.explanation || breakDoc?.payload.explanation
                          }
                          onStatusChange={() => {
                            void queryClient.invalidateQueries({
                              queryKey: ["oversight-snapshot"],
                            });
                          }}
                        />
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </AnimatedPage>
  );
};

export default Reconciliation;
