import { describe, test } from "vite-plus/test";
import { op12Crocodile069 } from "../../../../../cards/src/cards/OP12/characters/069-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-069 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Crocodile069);
  });
});
