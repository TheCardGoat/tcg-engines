import { describe, test } from "vite-plus/test";
import { op04Carmel101 } from "../../../../../cards/src/cards/OP04/characters/101-carmel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-101 Carmel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Carmel101);
  });
});
