import { describe, test } from "vite-plus/test";
import { op02Hina110 } from "../../../../../cards/src/cards/characters/op02-110-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-110 Hina", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Hina110);
  });
});
