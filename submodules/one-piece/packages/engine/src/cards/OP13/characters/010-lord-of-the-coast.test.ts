import { describe, test } from "vite-plus/test";
import { op13LordOfTheCoast010 } from "../../../../../cards/src/cards/OP13/characters/010-lord-of-the-coast.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-010 Lord of the Coast", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13LordOfTheCoast010);
  });
});
