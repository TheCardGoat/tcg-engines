import { describe, test } from "vite-plus/test";
import { op03Curiel004 } from "../../../../../cards/src/cards/characters/op03-004-curiel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-004 Curiel", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Curiel004);
  });
});
