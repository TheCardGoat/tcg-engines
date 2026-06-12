import { describe, test } from "vite-plus/test";
import { op05Mansherry088 } from "../../../../../cards/src/cards/OP05/characters/088-mansherry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-088 Mansherry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Mansherry088);
  });
});
