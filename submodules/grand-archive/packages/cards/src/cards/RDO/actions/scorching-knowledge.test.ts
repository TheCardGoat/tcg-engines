import { describe } from "vitest";
import { scorchingKnowledge } from "./scorching-knowledge.ts";
import { proveEmpowerAction } from "../../../testing/empower-action.ts";
/** @covers ECx3KFWqFD-a1 */
describe("Scorching Knowledge — Empower 3", () => proveEmpowerAction(scorchingKnowledge));
