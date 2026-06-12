import { describe, test } from "vite-plus/test";
import { op09MarshallDTeach081 } from "../../../../../cards/src/cards/OP09/leaders/081-marshall-d-teach.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-081 Marshall.D.Teach", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MarshallDTeach081);
  });
});
