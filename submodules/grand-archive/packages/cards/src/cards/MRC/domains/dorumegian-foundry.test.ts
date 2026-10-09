import { describe } from "vitest";
import { dorumegianFoundry } from "./dorumegian-foundry.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers CzwVavXMQU-a2 */
describe("dorumegianFoundry", () => {
  proveSummonOnEnter({
    card: dorumegianFoundry,
    token: automatonDrone,
    cost: 8,
    count: 1,
    abilityId: "CzwVavXMQU-a2",
    buff: 1,
  });
});

import { proveCountedActivationDiscount } from "../../../testing/counted-activation-discount.ts";
import { oasisTradingPost } from "../../ALC/domains/oasis-trading-post.ts";
/** @covers CzwVavXMQU-a1 */
describe("Dorumegian Foundry — capped domain discount", () => {
  proveCountedActivationDiscount({
    card: dorumegianFoundry,
    cost: 8,
    qualifying: oasisTradingPost,
    zone: "field",
    cap: 3,
    definitions: [automatonDrone],
    perObject: 2,
  });
});
