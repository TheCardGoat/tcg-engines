import { describe, test } from "vite-plus/test";
import { op02Cabaji052 } from "../../../../../cards/src/cards/OP02/characters/052-cabaji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-052 Cabaji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Cabaji052);
  });
});
