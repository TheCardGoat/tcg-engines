import { describe, test } from "vite-plus/test";
import { op02Mr3Galdino065 } from "../../../../../cards/src/cards/OP02/characters/065-mr-3-galdino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-065 Mr.3 (Galdino)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Mr3Galdino065);
  });
});
