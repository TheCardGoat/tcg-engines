import { describe, test } from "vite-plus/test";
import { op10Diamante068 } from "../../../../../cards/src/cards/OP10/characters/068-diamante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-068 Diamante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Diamante068);
  });
});
