import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { channeltechCharmS } from "./channeltech-charm-s.ts";

/** @covers rR2j9dQRDH-a1 */
describe("ChannelTech Charm S — entry draw", () => {
  proveOnEnterDraw({
    card: channeltechCharmS,
    abilityId: "rR2j9dQRDH-a1",
    cost: { kind: "reserve", amount: 2 },
    destination: "memory",
  });
});
