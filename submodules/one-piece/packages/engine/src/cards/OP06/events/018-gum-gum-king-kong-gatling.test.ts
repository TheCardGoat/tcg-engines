import { describe, test } from "vite-plus/test";
import { op06GumGumKingKongGatling018 } from "../../../../../cards/src/cards/OP06/events/018-gum-gum-king-kong-gatling.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-018 Gum-Gum King Kong Gatling", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06GumGumKingKongGatling018);
  });
});
