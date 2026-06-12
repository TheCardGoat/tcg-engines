import { describe, test } from "vite-plus/test";
import { op03ChimneyGonbe065 } from "../../../../../cards/src/cards/OP03/characters/065-chimney-gonbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-065 Chimney & Gonbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03ChimneyGonbe065);
  });
});
