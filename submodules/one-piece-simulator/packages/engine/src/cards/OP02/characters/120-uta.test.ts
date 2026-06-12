import { describe, test } from "vite-plus/test";
import { op02Uta120 } from "../../../../../cards/src/cards/OP02/characters/120-uta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-120 Uta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Uta120);
  });
});
