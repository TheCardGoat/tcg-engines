import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { captivatingOpulence } from "./captivating-opulence.ts";

/** @covers tnl3qr42vp-a1 */
describe("Captivating Opulence — entry draw", () => {
  proveOnEnterDraw({
    card: captivatingOpulence,
    abilityId: "tnl3qr42vp-a1",
    cost: { kind: "reserve", amount: 3 },
    destination: "memory",
  });
});
