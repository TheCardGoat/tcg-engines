import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { whisperwindCompass } from "./whisperwind-compass.ts";

/** @covers UXqhPZEq0X-a1 */
describe("Whisperwind Compass — entry draw", () => {
  proveOnEnterDraw({
    card: whisperwindCompass,
    abilityId: "UXqhPZEq0X-a1",
    cost: { kind: "reserve", amount: 3 },
    destination: "memory",
  });
});
