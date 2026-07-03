import { describe, test } from "vite-plus/test";
import { op09Bepo074 } from "../../../../../cards/src/cards/OP09/characters/074-bepo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-074 Bepo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Bepo074);
  });
});
