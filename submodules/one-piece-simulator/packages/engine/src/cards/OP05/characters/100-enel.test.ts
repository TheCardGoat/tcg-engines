import { describe, test } from "vite-plus/test";
import { op05Enel100 } from "../../../../../cards/src/cards/OP05/characters/100-enel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-100 Enel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Enel100);
  });
});
