import { describe, test } from "vite-plus/test";
import { op06HodyJones020 } from "../../../../../cards/src/cards/leaders/op06-020-hody-jones.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-020 Hody Jones", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06HodyJones020);
  });
});
