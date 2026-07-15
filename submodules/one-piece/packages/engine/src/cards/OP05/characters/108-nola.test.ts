import { describe, test } from "vite-plus/test";
import { op05Nola108 } from "../../../../../cards/src/cards/OP05/characters/108-nola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-108 Nola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Nola108);
  });
});
