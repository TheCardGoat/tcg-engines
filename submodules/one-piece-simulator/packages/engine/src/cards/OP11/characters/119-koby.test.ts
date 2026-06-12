import { describe, test } from "vite-plus/test";
import { op11Koby119 } from "../../../../../cards/src/cards/OP11/characters/119-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-119 Koby", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Koby119);
  });
});
