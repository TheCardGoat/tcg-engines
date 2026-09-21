import { describe, test } from "vite-plus/test";
import { op07BoaHancock038 } from "../../../../../cards/src/cards/leaders/op07-038-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-038 Boa Hancock", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BoaHancock038);
  });
});
