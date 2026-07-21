import type { KnowledgeAskRequest, KnowledgeAskResponse } from "@/types/knowledge";

// Vellum backend base (same host the procedure/exception API uses).
const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000") as string;

/**
 * Ask a natural-language question of the knowledge repository.
 * Runs the Vellum agentic knowledge_lookup pipeline and returns a cited answer.
 */
export async function knowledgeAsk(
  query: string,
  options?: { filters?: Record<string, string>; minTrust?: string },
): Promise<KnowledgeAskResponse> {
  const body: KnowledgeAskRequest = {
    query,
    filters: options?.filters ?? null,
    min_trust: options?.minTrust ?? null,
  };
  const res = await fetch(`${API_BASE}/api/v1/rag/knowledge/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<KnowledgeAskResponse>;
}
