import { describe, test } from "vite-plus/test";
import { op13Sanji027 } from "../../../../../cards/src/cards/OP13/characters/027-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-027 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Sanji027);
  });
});
