import { describe, test } from "vite-plus/test";
import { op05ChopaEmon068 } from "../../../../../cards/src/cards/OP05/characters/068-chopa-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-068 Chopa-Emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ChopaEmon068);
  });
});
