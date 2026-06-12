import { describe, test } from "vite-plus/test";
import { op12BoaHancock014 } from "../../../../../cards/src/cards/OP12/characters/014-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-014 Boa Hancock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12BoaHancock014);
  });
});
