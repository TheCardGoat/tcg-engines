import { describe, test } from "vite-plus/test";
import { op05Kaido118 } from "../../../../../cards/src/cards/OP05/characters/118-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-118 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Kaido118);
  });
});
