/**
 * Lightweight contract checks for oversight API paths (P2).
 * Run: node --experimental-strip-types --test src/lib/oversightPaths.test.ts
 * or: npm run typecheck
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

const API_PREFIX = "/api/v1/oversight";

describe("oversight API path contracts", () => {
  it("uses backend moat endpoints only", () => {
    const paths = {
      run: `${API_PREFIX}/run`,
      snapshot: `${API_PREFIX}/snapshot`,
      runs: `${API_PREFIX}/runs`,
      sampleCsv: `${API_PREFIX}/ingest/sample-csv`,
      explain: (id: string) => `${API_PREFIX}/breaks/${encodeURIComponent(id)}/explain`,
      status: (id: string) => `${API_PREFIX}/breaks/${encodeURIComponent(id)}/status`,
      events: (id: string) => `${API_PREFIX}/breaks/${encodeURIComponent(id)}/events`,
    };
    assert.equal(paths.run, "/api/v1/oversight/run");
    assert.equal(paths.sampleCsv, "/api/v1/oversight/ingest/sample-csv");
    assert.equal(
      paths.explain("abc/def"),
      "/api/v1/oversight/breaks/abc%2Fdef/explain",
    );
    assert.equal(
      paths.status("b1"),
      "/api/v1/oversight/breaks/b1/status",
    );
    assert.equal(
      paths.events("b1"),
      "/api/v1/oversight/breaks/b1/events",
    );
  });
});
