import { proveOptionalLoot } from "../../../testing/optional-loot.ts";
import { describe } from "vitest";
import { cemeterySentry } from "./cemetery-sentry.ts";

/** @covers hDUP6BY5Cx-a1 */
describe("Cemetery Sentry \u2014 resolution", () => {
  proveOptionalLoot({
    card: cemeterySentry,
    abilityId: "hDUP6BY5Cx-a1",
    onAttack: false,
    cost: 4,
    fireOnly: true,
  });
});
