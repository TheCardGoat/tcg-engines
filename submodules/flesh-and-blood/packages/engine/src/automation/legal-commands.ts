/**
 * Legal-command enumeration is engine-core logic (the authoritative pass-only
 * derivation runs inside command dispatch), so it lives in rules/. This module
 * remains the stable public path for the pack entry and automation consumers.
 */
export * from "../rules/legal-commands/index.ts";
