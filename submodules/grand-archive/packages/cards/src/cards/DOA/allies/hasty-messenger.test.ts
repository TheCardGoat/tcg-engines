import { proveOptionalLoot } from "../../../testing/optional-loot.ts";
import { describe } from "vitest";
import { hastyMessenger } from "./hasty-messenger.ts";

/** @covers DsiRzt0trX-a1 */
describe("Hasty Messenger \u2014 resolution", () => {
  proveOptionalLoot({ card: hastyMessenger, abilityId: "DsiRzt0trX-a1", onAttack: true });
});
