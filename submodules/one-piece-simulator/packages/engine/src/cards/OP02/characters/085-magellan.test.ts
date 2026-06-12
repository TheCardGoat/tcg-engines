import { describe, test } from "vite-plus/test";
import { op02Magellan085 } from "../../../../../cards/src/cards/OP02/characters/085-magellan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-085 Magellan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Magellan085);
  });
});
