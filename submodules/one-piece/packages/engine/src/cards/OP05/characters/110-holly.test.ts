import { describe, test } from "vite-plus/test";
import { op05Holly110 } from "../../../../../cards/src/cards/OP05/characters/110-holly.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-110 Holly", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Holly110);
  });
});
