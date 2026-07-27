import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  explainOversightBreak,
  listBreakEvents,
  updateBreakStatus,
  type BreakStatus,
} from "@/lib/oversightApi";

type ExplainPayload = {
  break_id: string;
  run_id?: string;
  headline?: string;
  plain_language?: string;
  severity?: string;
  status?: string;
  assignee?: string | null;
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

type BreakEvent = {
  from_status?: string;
  to_status?: string;
  actor?: string;
  note?: string | null;
  assignee?: string | null;
  created_at?: string;
};

type Props = {
  breakId: string;
  accountId: string;
  securityId?: string;
  fallbackExplanation?: string;
  reasonCode?: string;
  onStatusChange?: () => void;
};

const NEXT_ACTIONS: Record<string, { label: string; status: BreakStatus }[]> = {
  open: [
    { label: "Acknowledge", status: "acknowledged" },
    { label: "In review", status: "in_review" },
    { label: "Resolve", status: "resolved" },
    { label: "Dismiss", status: "dismissed" },
  ],
  acknowledged: [
    { label: "In review", status: "in_review" },
    { label: "Resolve", status: "resolved" },
    { label: "Dismiss", status: "dismissed" },
  ],
  in_review: [
    { label: "Resolve", status: "resolved" },
    { label: "Dismiss", status: "dismissed" },
  ],
  resolved: [{ label: "Reopen", status: "open" }],
  dismissed: [{ label: "Reopen", status: "open" }],
};

/**
 * Progressive disclosure for break meaning — portal consumes backend explain API.
 * Operator → Control → Power user. Triage calls backend status transitions only.
 */
export default function BreakExplainPanel({
  breakId,
  accountId,
  securityId,
  fallbackExplanation,
  reasonCode,
  onStatusChange,
}: Props) {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explain, setExplain] = useState<ExplainPayload | null>(null);
  const [events, setEvents] = useState<BreakEvent[]>([]);
  const [assignee, setAssignee] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = () => {
    setLoading(true);
    setError(null);
    Promise.all([explainOversightBreak(breakId), listBreakEvents(breakId)])
      .then(([data, trail]) => {
        setExplain(data as ExplainPayload);
        setEvents(trail as BreakEvent[]);
        const a = (data as ExplainPayload).assignee;
        if (typeof a === "string" && a) setAssignee(a);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load explanation");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([explainOversightBreak(breakId), listBreakEvents(breakId)])
      .then(([data, trail]) => {
        if (cancelled) return;
        setExplain(data as ExplainPayload);
        setEvents(trail as BreakEvent[]);
        const a = (data as ExplainPayload).assignee;
        if (typeof a === "string" && a) setAssignee(a);
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

  const currentStatus = (explain?.status || "open").toLowerCase();
  const actions = NEXT_ACTIONS[currentStatus] || [];

  const runTransition = async (status: BreakStatus) => {
    setBusy(true);
    setActionError(null);
    try {
      await updateBreakStatus(breakId, {
        status,
        assignee: assignee.trim() || undefined,
        note: note.trim() || undefined,
      });
      setNote("");
      reload();
      onStatusChange?.();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Transition failed");
    } finally {
      setBusy(false);
    }
  };

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
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            label={reasonCode || explain?.headline || "BREAK"}
            color="error"
            variant="outlined"
          />
          {explain?.status && (
            <Chip size="small" label={explain.status} variant="outlined" />
          )}
          {explain?.assignee && (
            <Chip size="small" label={`Owner: ${explain.assignee}`} />
          )}
        </Stack>
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

          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Triage
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ mb: 1 }}
            >
              <TextField
                size="small"
                label="Assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="ops.desk"
                sx={{ minWidth: 160 }}
              />
              <TextField
                size="small"
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {actions.map((action) => (
                <Button
                  key={action.status}
                  size="small"
                  variant="outlined"
                  disabled={busy}
                  onClick={() => void runTransition(action.status)}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
            {actionError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                {actionError}
              </Typography>
            )}
            {events.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" component="div">
                  Audit trail
                </Typography>
                {events.map((ev, idx) => (
                  <Typography
                    key={`${ev.created_at}-${idx}`}
                    variant="caption"
                    color="text.secondary"
                    component="div"
                  >
                    {ev.from_status} → {ev.to_status}
                    {ev.assignee ? ` · ${ev.assignee}` : ""}
                    {ev.note ? ` — ${ev.note}` : ""}
                    {ev.actor ? ` (${ev.actor})` : ""}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
