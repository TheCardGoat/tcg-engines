import { describe, test } from "vite-plus/test";
import { op05Pell014 } from "../../../../../cards/src/cards/OP05/characters/014-pell.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-014 Pell", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Pell014);
  });
});
