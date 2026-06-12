import { describe, test } from "vite-plus/test";
import { op11Tashigi007 } from "../../../../../cards/src/cards/OP11/characters/007-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-007 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Tashigi007);
  });
});
