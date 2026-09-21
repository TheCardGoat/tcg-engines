import { describe, test } from "vite-plus/test";
import { op09MarshallDTeach081 } from "../../../../../cards/src/cards/leaders/op09-081-marshall-d-teach.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-081 Marshall.D.Teach", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MarshallDTeach081);
  });
});
