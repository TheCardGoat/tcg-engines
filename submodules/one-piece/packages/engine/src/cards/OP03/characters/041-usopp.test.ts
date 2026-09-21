import { describe, test } from "vite-plus/test";
import { op03Usopp041 } from "../../../../../cards/src/cards/characters/op03-041-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-041 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Usopp041);
  });
});
