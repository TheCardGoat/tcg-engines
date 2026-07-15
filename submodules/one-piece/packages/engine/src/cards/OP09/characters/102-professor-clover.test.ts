import { describe, test } from "vite-plus/test";
import { op09ProfessorClover102 } from "../../../../../cards/src/cards/OP09/characters/102-professor-clover.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-102 Professor Clover", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ProfessorClover102);
  });
});
