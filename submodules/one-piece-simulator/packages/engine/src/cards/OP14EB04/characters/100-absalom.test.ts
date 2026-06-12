import { describe, test } from "vite-plus/test";
import { op14eb04Absalom100 } from "../../../../../cards/src/cards/OP14EB04/characters/100-absalom.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-100 Absalom", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Absalom100);
  });
});
