import { describe, test } from "vite-plus/test";
import { op02Wanda044 } from "../../../../../cards/src/cards/OP02/characters/044-wanda.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-044 Wanda", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Wanda044);
  });
});
