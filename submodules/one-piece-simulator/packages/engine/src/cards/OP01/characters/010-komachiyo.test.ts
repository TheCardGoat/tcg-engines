import { describe, test } from "vite-plus/test";
import { op01Komachiyo010 } from "../../../../../cards/src/cards/OP01/characters/010-komachiyo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-010 Komachiyo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Komachiyo010);
  });
});
