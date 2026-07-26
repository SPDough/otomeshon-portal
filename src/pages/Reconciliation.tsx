import { useMemo } from "react";
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
import { getOversightSnapshot, runOversightSlice } from "@/lib/oversightApi";
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

  const snapshotQuery = useQuery({
    queryKey: ["oversight-snapshot"],
    queryFn: getOversightSnapshot,
    retry: 1,
  });

  const runMutation = useMutation({
    mutationFn: runOversightSlice,
    onSuccess: (data) => {
      queryClient.setQueryData(["oversight-snapshot"], data);
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

  const resultsById = useMemo(() => {
    const map = new Map<string, NonNullable<typeof snapshot>["rule_results"][number]>();
    for (const item of snapshot?.rule_results ?? []) {
      map.set(item.payload.rule_result_id, item);
    }
    return map;
  }, [snapshot]);

  const error =
    (runMutation.error as Error | null)?.message ||
    (snapshotQuery.error as Error | null)?.message;

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
                OMS intent vs ABOR/custodian outcome, evaluated by Vellum JSON-first
                deterministic rules.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => snapshotQuery.refetch()}
                disabled={snapshotQuery.isFetching}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => runMutation.mutate()}
                disabled={runMutation.isPending}
              >
                Run slice
              </Button>
            </Stack>
          </Box>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}. Ensure Vellum is running at{" "}
            {import.meta.env.VITE_API_URL ?? "http://localhost:8000"} and CORS allows
            this origin.
          </Alert>
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
                        (c) => c.break_id === item.payload.break_id,
                      );
                      const result = comparison?.rule_result_id
                        ? resultsById.get(comparison.rule_result_id)
                        : undefined;
                      const breakDoc = breaksById.get(item.payload.break_id);
                      return (
                        <Box
                          key={item.payload.break_id}
                          sx={{
                            p: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            spacing={1}
                            sx={{ mb: 1 }}
                          >
                            <Typography fontWeight={600}>
                              {item.payload.account_id} · {comparison?.security_id}
                            </Typography>
                            <Chip
                              size="small"
                              label={item.payload.reason_code}
                              color="error"
                              variant="outlined"
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.payload.explanation || breakDoc?.payload.explanation}
                          </Typography>
                          {result?.payload.evidence_snapshot && (
                            <Typography
                              component="pre"
                              variant="caption"
                              sx={{
                                m: 0,
                                p: 1.5,
                                bgcolor: alpha(theme.palette.text.primary, 0.04),
                                borderRadius: 1,
                                overflow: "auto",
                              }}
                            >
                              {JSON.stringify(result.payload.evidence_snapshot, null, 2)}
                            </Typography>
                          )}
                        </Box>
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
