import type {
  NativeRuleDefinition,
  OversightRunSummary,
  OversightSnapshot,
} from "@/types/oversight";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000") as string;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function runOversightSlice(): Promise<OversightSnapshot> {
  return apiFetch<OversightSnapshot>("/api/v1/oversight/run", { method: "POST" });
}

export async function runSampleCsvIngest(): Promise<OversightSnapshot> {
  return apiFetch<OversightSnapshot>("/api/v1/oversight/ingest/sample-csv", {
    method: "POST",
  });
}

export async function getOversightSnapshot(runId?: string): Promise<OversightSnapshot> {
  const qs = runId ? `?run_id=${encodeURIComponent(runId)}` : "";
  return apiFetch<OversightSnapshot>(`/api/v1/oversight/snapshot${qs}`);
}

export async function listOversightRuns(limit = 10): Promise<OversightRunSummary[]> {
  return apiFetch<OversightRunSummary[]>(`/api/v1/oversight/runs?limit=${limit}`);
}

export async function explainOversightBreak(breakId: string): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(
    `/api/v1/oversight/breaks/${encodeURIComponent(breakId)}/explain`,
  );
}
