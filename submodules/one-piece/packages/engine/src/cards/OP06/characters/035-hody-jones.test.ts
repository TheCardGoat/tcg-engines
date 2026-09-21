import { describe, test } from "vite-plus/test";
import { op06HodyJones035 } from "../../../../../cards/src/cards/characters/op06-035-hody-jones.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-035 Hody Jones", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06HodyJones035);
  });
});
