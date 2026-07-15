import { describe, test } from "vite-plus/test";
import { eb02HodyJones020 } from "../../../../../cards/src/cards/EB02/leaders/020-hody-jones.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-020 Hody Jones", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02HodyJones020);
  });
});
