import { describe, test } from "vite-plus/test";
import { op13ScopperGaban067 } from "../../../../../cards/src/cards/OP13/characters/067-scopper-gaban.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-067 Scopper Gaban", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13ScopperGaban067);
  });
});
