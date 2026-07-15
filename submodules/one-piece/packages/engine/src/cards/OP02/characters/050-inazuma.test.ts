import { describe, test } from "vite-plus/test";
import { op02Inazuma050 } from "../../../../../cards/src/cards/OP02/characters/050-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-050 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Inazuma050);
  });
});
