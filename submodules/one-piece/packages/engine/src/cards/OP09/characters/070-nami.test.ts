import { describe, test } from "vite-plus/test";
import { op09Nami070 } from "../../../../../cards/src/cards/OP09/characters/070-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-070 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Nami070);
  });
});
