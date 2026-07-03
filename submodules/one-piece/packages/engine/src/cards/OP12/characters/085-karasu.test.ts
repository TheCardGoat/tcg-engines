import { describe, test } from "vite-plus/test";
import { op12Karasu085 } from "../../../../../cards/src/cards/OP12/characters/085-karasu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-085 Karasu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Karasu085);
  });
});
