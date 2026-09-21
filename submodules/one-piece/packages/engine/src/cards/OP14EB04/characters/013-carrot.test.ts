import { describe, test } from "vite-plus/test";
import { op14eb04Carrot013 } from "../../../../../cards/src/cards/characters/eb04-013-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-013 Carrot", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Carrot013);
  });
});
