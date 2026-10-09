import { describe } from "vitest";
import { prismspireScepter } from "./prismspire-scepter.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers mgesApvmwS-a2 */
describe("prismspireScepter — banish to draw", () => {
  proveBanishItemDraw({
    card: prismspireScepter,
    abilityId: "mgesApvmwS-a2",
    cost: 3,
    destination: "memory",
  });
});
