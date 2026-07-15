import { describe, test } from "vite-plus/test";
import { op02Blenheim012 } from "../../../../../cards/src/cards/OP02/characters/012-blenheim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-012 Blenheim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Blenheim012);
  });
});
