import { describe, test } from "vite-plus/test";
import { op13Franky033 } from "../../../../../cards/src/cards/OP13/characters/033-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-033 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Franky033);
  });
});
