import { describe, test } from "vite-plus/test";
import { op04Kuro023 } from "../../../../../cards/src/cards/characters/op04-023-kuro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-023 Kuro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Kuro023);
  });
});
