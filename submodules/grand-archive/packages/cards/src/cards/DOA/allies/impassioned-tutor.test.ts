import { proveOnAttackLevel } from "../../../testing/on-attack-level.ts";
import { describe } from "vitest";
import { impassionedTutor } from "./impassioned-tutor.ts";

/** @covers MECS7RHRZ8-a1 */
describe("Impassioned Tutor \u2014 resolution", () => {
  proveOnAttackLevel({ card: impassionedTutor, abilityId: "MECS7RHRZ8-a1", mode: "ally", cost: 2 });
});
