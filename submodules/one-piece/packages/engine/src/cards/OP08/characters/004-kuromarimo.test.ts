import { describe, test } from "vite-plus/test";
import { op08Kuromarimo004 } from "../../../../../cards/src/cards/OP08/characters/004-kuromarimo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-004 Kuromarimo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Kuromarimo004);
  });
});
