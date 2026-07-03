import { describe, test } from "vite-plus/test";
import { op10Baby5076 } from "../../../../../cards/src/cards/OP10/characters/076-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-076 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Baby5076);
  });
});
