import { describe, test } from "vite-plus/test";
import { op14eb04Bepo012 } from "../../../../../cards/src/cards/OP14EB04/characters/012-bepo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-012 Bepo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Bepo012);
  });
});
