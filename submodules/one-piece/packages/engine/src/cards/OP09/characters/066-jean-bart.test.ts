import { describe, test } from "vite-plus/test";
import { op09JeanBart066 } from "../../../../../cards/src/cards/OP09/characters/066-jean-bart.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-066 Jean Bart", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09JeanBart066);
  });
});
