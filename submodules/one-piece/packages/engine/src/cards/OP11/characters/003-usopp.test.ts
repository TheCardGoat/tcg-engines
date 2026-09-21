import { describe, test } from "vite-plus/test";
import { op11Usopp003 } from "../../../../../cards/src/cards/characters/op11-003-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-003 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Usopp003);
  });
});
