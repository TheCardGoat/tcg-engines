import { describe, test } from "vite-plus/test";
import { eb02Carrot021 } from "../../../../../cards/src/cards/EB02/leaders/021-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-021 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Carrot021);
  });
});
