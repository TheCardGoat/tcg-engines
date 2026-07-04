import { describe, test } from "vite-plus/test";
import { op10Pica074 } from "../../../../../cards/src/cards/OP10/characters/074-pica.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-074 Pica", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Pica074);
  });
});
