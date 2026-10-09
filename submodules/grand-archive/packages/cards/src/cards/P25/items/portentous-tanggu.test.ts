import { describe } from "vitest";
import { portentousTanggu } from "./portentous-tanggu.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers mb3iqw3kc6-a2 */
describe("portentousTanggu — banish to draw", () => {
  proveBanishItemDraw({
    card: portentousTanggu,
    abilityId: "mb3iqw3kc6-a2",
    cost: 3,
    destination: "memory",
  });
});
