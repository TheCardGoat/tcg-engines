import { describe, test } from "vite-plus/test";
import { op06HodyJones020 } from "../../../../../cards/src/cards/OP06/leaders/020-hody-jones.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-020 Hody Jones", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06HodyJones020);
  });
});
