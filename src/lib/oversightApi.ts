import type { NativeRuleDefinition, OversightSnapshot } from "@/types/oversight";

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

export async function getOversightSnapshot(): Promise<OversightSnapshot> {
  return apiFetch<OversightSnapshot>("/api/v1/oversight/snapshot");
}

export async function listNativeRuleDefinitions(): Promise<NativeRuleDefinition[]> {
  return apiFetch<NativeRuleDefinition[]>("/api/v1/rules/definitions");
}
