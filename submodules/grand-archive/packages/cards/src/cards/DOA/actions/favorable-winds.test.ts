import { proveAllyBuffAction } from "../../../testing/ally-buff-action.ts";
import { describe } from "vitest";
import { favorableWinds } from "./favorable-winds.ts";

/** @covers dsAqxMezGb-a1 */
describe("Favorable Winds \u2014 resolution", () => {
  proveAllyBuffAction({ card: favorableWinds, cost: 1, lifeBonus: 1, powerBonus: 0 });
});
