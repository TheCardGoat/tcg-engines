import { describe } from "vitest";
import { oneiricKey } from "./oneiric-key.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers pY1TImPn8g-a2 */
describe("oneiricKey — banish to draw", () => {
  proveBanishItemDraw({
    card: oneiricKey,
    abilityId: "pY1TImPn8g-a2",
    cost: 4,
    destination: "memory",
  });
});

import { provePhantasmagoriaEntry } from "../../../testing/phantasmagoria-entry.ts";
/** @covers pY1TImPn8g-a1 */
describe("Oneiric Key mastery counter", () => provePhantasmagoriaEntry(oneiricKey, true));
