import { describe, test } from "vite-plus/test";
import { op08Carrot021 } from "../../../../../cards/src/cards/OP08/leaders/021-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-021 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Carrot021);
  });
});
