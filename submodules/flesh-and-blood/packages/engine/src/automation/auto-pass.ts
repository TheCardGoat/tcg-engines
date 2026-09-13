/**
 * The pass-only derivation is engine-core logic drained inside command
 * dispatch, so it lives in rules/. This module remains the stable public path
 * for the simulator API surface and automation consumers.
 */
export * from "../rules/auto-pass.ts";
