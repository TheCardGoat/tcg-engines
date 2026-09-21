import { describe, test } from "vite-plus/test";
import { op02Doberman107 } from "../../../../../cards/src/cards/characters/op02-107-doberman.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-107 Doberman", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Doberman107);
  });
});
