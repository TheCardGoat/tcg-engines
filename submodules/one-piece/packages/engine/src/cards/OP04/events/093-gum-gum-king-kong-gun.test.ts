import { describe, test } from "vite-plus/test";
import { op04GumGumKingKongGun093 } from "../../../../../cards/src/cards/OP04/events/093-gum-gum-king-kong-gun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-093 Gum-Gum King Kong Gun", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04GumGumKingKongGun093);
  });
});
