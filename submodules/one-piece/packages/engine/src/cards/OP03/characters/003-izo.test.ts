import { describe, test } from "vite-plus/test";
import { op03Izo003 } from "../../../../../cards/src/cards/characters/op03-003-izo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-003 Izo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Izo003);
  });
});
