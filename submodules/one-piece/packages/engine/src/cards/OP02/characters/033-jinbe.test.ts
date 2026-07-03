import { describe, test } from "vite-plus/test";
import { op02Jinbe033 } from "../../../../../cards/src/cards/OP02/characters/033-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-033 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Jinbe033);
  });
});
