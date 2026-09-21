import { describe, test } from "vite-plus/test";
import { op01Crocodile062 } from "../../../../../cards/src/cards/leaders/op01-062-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-062 Crocodile", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Crocodile062);
  });
});
