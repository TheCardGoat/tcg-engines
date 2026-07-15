import { describe, test } from "vite-plus/test";
import { op01Jinbe014 } from "../../../../../cards/src/cards/OP01/characters/014-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-014 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Jinbe014);
  });
});
