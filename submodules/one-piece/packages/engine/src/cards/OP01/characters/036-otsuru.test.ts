import { describe, test } from "vite-plus/test";
import { op01Otsuru036 } from "../../../../../cards/src/cards/OP01/characters/036-otsuru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-036 Otsuru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Otsuru036);
  });
});
