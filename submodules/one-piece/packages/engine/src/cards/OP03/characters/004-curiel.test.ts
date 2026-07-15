import { describe, test } from "vite-plus/test";
import { op03Curiel004 } from "../../../../../cards/src/cards/OP03/characters/004-curiel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-004 Curiel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Curiel004);
  });
});
