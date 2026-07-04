import { describe, test } from "vite-plus/test";
import { op03Minorhinoceros069 } from "../../../../../cards/src/cards/OP03/characters/069-minorhinoceros.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-069 Minorhinoceros", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Minorhinoceros069);
  });
});
