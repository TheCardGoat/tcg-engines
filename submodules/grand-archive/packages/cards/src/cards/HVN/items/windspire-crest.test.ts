import { describe } from "vitest";
import { windspireCrest } from "./windspire-crest.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers lzfkc8ntn4-a2 */
describe("windspireCrest — banish to draw", () => {
  proveBanishItemDraw({
    card: windspireCrest,
    abilityId: "lzfkc8ntn4-a2",
    cost: 4,
    destination: "hand",
  });
});
