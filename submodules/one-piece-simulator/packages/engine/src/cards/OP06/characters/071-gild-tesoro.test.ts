import { describe, test } from "vite-plus/test";
import { op06GildTesoro071 } from "../../../../../cards/src/cards/OP06/characters/071-gild-tesoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-071 Gild Tesoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06GildTesoro071);
  });
});
