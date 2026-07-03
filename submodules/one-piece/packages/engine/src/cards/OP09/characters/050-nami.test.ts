import { describe, test } from "vite-plus/test";
import { op09Nami050 } from "../../../../../cards/src/cards/OP09/characters/050-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-050 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Nami050);
  });
});
