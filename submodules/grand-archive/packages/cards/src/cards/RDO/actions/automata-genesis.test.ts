import { describe } from "vitest";
import { automataGenesis } from "./automata-genesis.ts";
import { titanMkIi } from "../../RDO/tokens/titan-mk-ii.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers 0L0AUYTwqU-a1 */
describe("automataGenesis", () => {
  proveSummonAction({ card: automataGenesis, cost: 12, tokens: [{ card: titanMkIi, count: 3 }] });
});
