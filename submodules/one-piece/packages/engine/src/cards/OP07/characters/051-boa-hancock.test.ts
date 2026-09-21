import { describe, test } from "vite-plus/test";
import { op07BoaHancock051 } from "../../../../../cards/src/cards/characters/op07-051-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-051 Boa Hancock", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BoaHancock051);
  });
});
