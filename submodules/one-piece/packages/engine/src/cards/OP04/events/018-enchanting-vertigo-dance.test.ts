import { describe, test } from "vite-plus/test";
import { op04EnchantingVertigoDance018 } from "../../../../../cards/src/cards/OP04/events/018-enchanting-vertigo-dance.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-018 Enchanting Vertigo Dance", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04EnchantingVertigoDance018);
  });
});
