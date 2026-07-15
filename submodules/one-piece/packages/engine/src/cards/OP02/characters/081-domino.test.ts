import { describe, test } from "vite-plus/test";
import { op02Domino081 } from "../../../../../cards/src/cards/OP02/characters/081-domino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-081 Domino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Domino081);
  });
});
