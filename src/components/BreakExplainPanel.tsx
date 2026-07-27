import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { explainOversightBreak } from "@/lib/oversightApi";

type ExplainPayload = {
  break_id: string;
  run_id?: string;
  headline?: string;
  plain_language?: string;
  severity?: string;
  status?: string;
  rule?: {
    rule_id?: string;
    rule_version?: string;
    result_code?: string;
  };
  comparison?: Record<string, unknown>;
  evidence?: Record<string, unknown>;
  expertise_levels?: {
    operator?: string;
    control?: Record<string, unknown>;
    power_user?: Record<string, unknown>;
  };
};

type Props = {
  breakId: string;
  accountId: string;
  securityId?: string;
  fallbackExplanation?: string;
  reasonCode?: string;
};

/**
 * Progressive disclosure for break meaning — portal consumes backend explain API.
 * Operator → Control → Power user. No rule logic lives here.
 */
export default function BreakExplainPanel({
  breakId,
  accountId,
  securityId,
  fallbackExplanation,
  reasonCode,
}: Props) {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explain, setExplain] = useState<ExplainPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    explainOversightBreak(breakId)
      .then((data) => {
        if (!cancelled) setExplain(data as ExplainPayload);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load explanation");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [breakId]);

  return (
    <Box
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
          {accountId}
          {securityId ? ` · ${securityId}` : ""}
        </Typography>
        <Chip
          size="small"
          label={reasonCode || explain?.headline || "BREAK"}
          color="error"
          variant="outlined"
        />
      </Stack>

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="caption" color="text.secondary">
            Loading explanation from Vellum…
          </Typography>
        </Stack>
      )}

      {error && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {fallbackExplanation || error}
        </Typography>
      )}

      {!loading && !error && explain && (
        <>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            sx={{ mb: 1, minHeight: 36 }}
          >
            <Tab label="Operator" sx={{ minHeight: 36, py: 0 }} />
            <Tab label="Control" sx={{ minHeight: 36, py: 0 }} />
            <Tab label="Power user" sx={{ minHeight: 36, py: 0 }} />
          </Tabs>

          {tab === 0 && (
            <Typography variant="body2" color="text.secondary">
              {explain.expertise_levels?.operator ||
                explain.plain_language ||
                fallbackExplanation}
            </Typography>
          )}

          {tab === 1 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rule{" "}
                <strong>{explain.rule?.rule_id || "—"}</strong> · version{" "}
                <strong>{explain.rule?.rule_version || "—"}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                Result code: {explain.rule?.result_code || "—"}
              </Typography>
              <Typography
                component="pre"
                variant="caption"
                sx={{
                  mt: 1,
                  m: 0,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.text.primary, 0.04),
                  borderRadius: 1,
                  overflow: "auto",
                }}
              >
                {JSON.stringify(explain.expertise_levels?.control || {}, null, 2)}
              </Typography>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Evidence
              </Typography>
              <Typography
                component="pre"
                variant="caption"
                sx={{
                  m: 0,
                  mb: 1,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.text.primary, 0.04),
                  borderRadius: 1,
                  overflow: "auto",
                }}
              >
                {JSON.stringify(explain.evidence || {}, null, 2)}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Contracts
              </Typography>
              <Typography
                component="pre"
                variant="caption"
                sx={{
                  m: 0,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.text.primary, 0.04),
                  borderRadius: 1,
                  overflow: "auto",
                  maxHeight: 240,
                }}
              >
                {JSON.stringify(explain.expertise_levels?.power_user || {}, null, 2)}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
