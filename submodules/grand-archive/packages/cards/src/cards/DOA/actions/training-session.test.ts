import { proveAllyBuffAction } from "../../../testing/ally-buff-action.ts";
import { describe } from "vitest";
import { trainingSession } from "./training-session.ts";

/** @covers G42RDwb3Ko-a1 */
describe("Training Session \u2014 resolution", () => {
  proveAllyBuffAction({
    card: trainingSession,
    cost: 2,
    lifeBonus: 1,
    powerBonus: 1,
    targeted: true,
    permanent: true,
  });
});
