import { describe, test } from "vite-plus/test";
import { op02Franky039 } from "../../../../../cards/src/cards/OP02/characters/039-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-039 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Franky039);
  });
});
