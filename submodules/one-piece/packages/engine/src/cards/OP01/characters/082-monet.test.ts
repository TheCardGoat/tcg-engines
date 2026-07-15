import { describe, test } from "vite-plus/test";
import { op01Monet082 } from "../../../../../cards/src/cards/OP01/characters/082-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-082 Monet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Monet082);
  });
});
