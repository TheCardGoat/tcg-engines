import { describe, test } from "vite-plus/test";
import { op02Blenheim012 } from "../../../../../cards/src/cards/characters/op02-012-blenheim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-012 Blenheim", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Blenheim012);
  });
});
