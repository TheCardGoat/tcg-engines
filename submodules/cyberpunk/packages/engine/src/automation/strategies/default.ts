import { expertOracleStrategy } from "../search/expert-oracle.ts";
import type { AIStrategy } from "../types.ts";

/** The Recommended alias uses the same full-information chooser as Expert. */
export const defaultStrategy: AIStrategy = { ...expertOracleStrategy, name: "default" };
