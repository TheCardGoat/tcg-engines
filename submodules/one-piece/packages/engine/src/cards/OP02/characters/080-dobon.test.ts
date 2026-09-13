import { describe, test } from "vite-plus/test";
import { op02Dobon080 } from "../../../../../cards/src/cards/OP02/characters/080-dobon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-080 Dobon", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Dobon080);
  });
});
