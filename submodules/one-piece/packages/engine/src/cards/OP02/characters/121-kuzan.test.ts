import { describe, test } from "vite-plus/test";
import { op02Kuzan121 } from "../../../../../cards/src/cards/characters/op02-121-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-121 Kuzan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Kuzan121);
  });
});
