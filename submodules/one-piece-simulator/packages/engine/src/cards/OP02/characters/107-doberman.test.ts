import { describe, test } from "vite-plus/test";
import { op02Doberman107 } from "../../../../../cards/src/cards/OP02/characters/107-doberman.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-107 Doberman", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Doberman107);
  });
});
