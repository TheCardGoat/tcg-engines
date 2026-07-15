import { describe, test } from "vite-plus/test";
import { op05Baby5033 } from "../../../../../cards/src/cards/OP05/characters/033-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-033 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Baby5033);
  });
});
