/** Types for Vellum custodian oversight (backend moat control objects). */

export type OversightSummary = {
  position_pairs: number;
  matched: number;
  breaks: number;
  missing_leg: number;
  rule_family: string;
  rule_version: string;
  source?: string;
};

export type OversightRunSummary = {
  run_id: string;
  ran_at: string;
  summary: OversightSummary;
  source?: string;
  rule_family?: string;
  rule_version?: string;
};

export type OversightComparison = {
  account_id: string;
  security_id: string;
  entity_id: string;
  oms_quantity: number | null;
  abor_quantity: number | null;
  absolute_quantity_difference: number | null;
  status: "matched" | "mismatch" | "break" | "missing_leg" | string;
  oms_contract_id?: string | null;
  abor_contract_id?: string | null;
  break_id?: string;
  break_ids?: string[];
  rule_result_id?: string;
  rule_result_ids?: string[];
  oms_market_value?: number | null;
  abor_market_value?: number | null;
  absolute_market_value_difference?: number | null;
};

export type OversightPosition = {
  contract_type: "Position";
  contract_version: string;
  source_system: string;
  source_type: string;
  source_record_id: string;
  lineage?: { book?: string; custodian?: string | null };
  payload: {
    entity_id: string;
    account_id: string;
    security_id: string;
    instrument_id?: string;
    quantity: number;
    currency: string;
    position_date: string;
    status: string;
  };
};

export type OversightBreak = {
  contract_type: "ReconciliationBreak";
  contract_version: string;
  payload: {
    break_id: string;
    break_type: string;
    entity_id: string;
    account_id: string;
    related_contract_ids: string[];
    severity: string;
    status: string;
    detected_at: string;
    reason_code: string;
    explanation: string;
  };
  lineage?: {
    rule_id?: string;
    rule_result_id?: string;
  };
};

export type OversightRuleResult = {
  contract_type: "RuleResult";
  payload: {
    rule_result_id: string;
    rule_id: string;
    evaluation_status: string;
    triggered: boolean;
    severity: string;
    result_code: string;
    explanation: string;
    evidence_snapshot?: Record<string, unknown>;
    created_reconciliation_break_id?: string;
  };
};

export type OversightSnapshot = {
  run_id: string;
  ran_at: string;
  summary: OversightSummary;
  source?: string;
  positions: OversightPosition[];
  comparisons: OversightComparison[];
  rule_results: OversightRuleResult[];
  breaks: OversightBreak[];
};

export type NativeRuleDefinition = {
  rule_family: string;
  version: string;
  rule_id: string;
  rule_name: string;
  status: string;
  expression_language?: string;
  description: string;
  engine: string;
};
