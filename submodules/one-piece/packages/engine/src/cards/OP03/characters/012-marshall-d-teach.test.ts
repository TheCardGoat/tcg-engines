import { describe, test } from "vite-plus/test";
import { op03MarshallDTeach012 } from "../../../../../cards/src/cards/characters/op03-012-marshall-d-teach.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-012 Marshall.D.Teach", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03MarshallDTeach012);
  });
});
