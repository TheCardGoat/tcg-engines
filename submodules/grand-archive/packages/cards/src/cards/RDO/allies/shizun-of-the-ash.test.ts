import { describe } from "vitest";
import { shizunOfTheAsh } from "./shizun-of-the-ash.ts";
import { proveOptionalLoot } from "../../../testing/optional-loot.ts";
/** @covers pnDUy9jUbo-a1 */
describe("shizunOfTheAsh optional entry discard", () =>
  proveOptionalLoot({
    card: shizunOfTheAsh,
    abilityId: "pnDUy9jUbo-a1",
    onAttack: false,
    cost: 2,
    buff: false,
  }));
