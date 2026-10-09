import { describe } from "vitest";
import { syntheticStrike } from "./synthetic-strike.ts";
import { proveSubtypeAttackTarget } from "../../../testing/subtype-attack-target.ts";
/** @covers 7nau5sw9f8-a1 */
describe("Synthetic Strike — Automaton unit", () =>
  proveSubtypeAttackTarget(syntheticStrike, "automaton-unit", 2, 3, 1));
