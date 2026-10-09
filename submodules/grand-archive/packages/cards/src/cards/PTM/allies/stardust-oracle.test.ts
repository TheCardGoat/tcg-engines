import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { stardustOracle } from "./stardust-oracle.ts";

/** @covers EPy8OUmPxa-a1 */
describe("Stardust Oracle — Imbue keyword", () => {
  proveImbueKeyword({
    card: stardustOracle,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});

import { proveClassPhaseSummon } from "../../../testing/class-phase-summon.ts";
import { astralShard } from "../../DTR/tokens/astral-shard.ts";
/** @covers EPy8OUmPxa-a3 */
describe("stardustOracle phase summon", () =>
  proveClassPhaseSummon(stardustOracle, astralShard, "end", false));
