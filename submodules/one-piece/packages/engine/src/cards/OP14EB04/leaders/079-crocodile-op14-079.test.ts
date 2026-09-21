import { describe, test } from "vite-plus/test";
import { op14eb04CrocodileOp14079079 } from "../../../../../cards/src/cards/leaders/op14-079-crocodile-op14-079.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-079 Crocodile - OP14-079", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04CrocodileOp14079079);
  });
});
