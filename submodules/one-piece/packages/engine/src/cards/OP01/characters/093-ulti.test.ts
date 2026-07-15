import { describe, test } from "vite-plus/test";
import { op01Ulti093 } from "../../../../../cards/src/cards/OP01/characters/093-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-093 Ulti", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Ulti093);
  });
});
