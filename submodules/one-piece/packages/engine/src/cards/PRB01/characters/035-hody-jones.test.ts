import { describe, test } from "vite-plus/test";
import { prb01HodyJones035 } from "../../../../../cards/src/cards/PRB01/characters/035-hody-jones.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-035 Hody Jones", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01HodyJones035);
  });
});
