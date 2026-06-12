import { describe, test } from "vite-plus/test";
import { op05Bellamy035 } from "../../../../../cards/src/cards/OP05/characters/035-bellamy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-035 Bellamy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Bellamy035);
  });
});
