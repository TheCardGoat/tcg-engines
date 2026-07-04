import { describe, test } from "vite-plus/test";
import { op03BobbinTheDisposer103 } from "../../../../../cards/src/cards/OP03/characters/103-bobbin-the-disposer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-103 Bobbin the Disposer", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03BobbinTheDisposer103);
  });
});
