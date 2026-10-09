import { describe } from "vitest";
import { floralArrangement } from "./floral-arrangement.ts";
import { silvershine } from "../../ALC/tokens/silvershine.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers dt4YncETqE-a1 */
describe("floralArrangement", () => {
  proveSummonAction({
    card: floralArrangement,
    cost: 3,
    tokens: [
      { card: silvershine, count: 1 },
      { card: fraysia, count: 1 },
    ],
  });
});
