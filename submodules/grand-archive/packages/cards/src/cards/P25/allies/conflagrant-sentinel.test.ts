import { describe } from "vitest";
import { conflagrantSentinel } from "./conflagrant-sentinel.ts";
import { proveOptionalLoot } from "../../../testing/optional-loot.ts";
/** @covers puyzn48srd-a1 */
describe("conflagrantSentinel optional entry discard", () =>
  proveOptionalLoot({
    card: conflagrantSentinel,
    abilityId: "puyzn48srd-a1",
    onAttack: false,
    cost: 3,
    buff: true,
  }));
