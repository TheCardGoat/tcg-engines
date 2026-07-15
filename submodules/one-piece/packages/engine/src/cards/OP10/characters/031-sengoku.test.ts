import { describe, test } from "vite-plus/test";
import { op10Sengoku031 } from "../../../../../cards/src/cards/OP10/characters/031-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-031 Sengoku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sengoku031);
  });
});
