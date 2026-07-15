import { describe, test } from "vite-plus/test";
import { op05HoneKichi072 } from "../../../../../cards/src/cards/OP05/characters/072-hone-kichi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-072 Hone-Kichi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05HoneKichi072);
  });
});
