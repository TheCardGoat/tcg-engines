import { describe, test } from "vite-plus/test";
import { op03CharlotteCracker108 } from "../../../../../cards/src/cards/OP03/characters/108-charlotte-cracker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-108 Charlotte Cracker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteCracker108);
  });
});
