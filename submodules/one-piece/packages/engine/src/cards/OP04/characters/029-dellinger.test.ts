import { describe, test } from "vite-plus/test";
import { op04Dellinger029 } from "../../../../../cards/src/cards/OP04/characters/029-dellinger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-029 Dellinger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Dellinger029);
  });
});
