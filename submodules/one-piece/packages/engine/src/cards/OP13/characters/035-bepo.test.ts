import { describe, test } from "vite-plus/test";
import { op13Bepo035 } from "../../../../../cards/src/cards/OP13/characters/035-bepo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-035 Bepo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Bepo035);
  });
});
