import { describe, test } from "vite-plus/test";
import { op14eb04Koala046 } from "../../../../../cards/src/cards/OP14EB04/characters/046-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-046 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Koala046);
  });
});
