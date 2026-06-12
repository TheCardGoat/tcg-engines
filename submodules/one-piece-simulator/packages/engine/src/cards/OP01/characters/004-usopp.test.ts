import { describe, test } from "vite-plus/test";
import { op01Usopp004 } from "../../../../../cards/src/cards/OP01/characters/004-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-004 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Usopp004);
  });
});
