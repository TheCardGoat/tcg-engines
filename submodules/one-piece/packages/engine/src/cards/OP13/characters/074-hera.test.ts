import { describe, test } from "vite-plus/test";
import { op13Hera074 } from "../../../../../cards/src/cards/OP13/characters/074-hera.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-074 Hera", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Hera074);
  });
});
