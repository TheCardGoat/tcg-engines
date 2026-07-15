import { describe, test } from "vite-plus/test";
import { op12MarshallDTeachSpGold093 } from "../../../../../cards/src/cards/OP12/characters/093-marshall-d-teach-sp-gold.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-093 Marshall.D.Teach (SP) (Gold)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12MarshallDTeachSpGold093);
  });
});
