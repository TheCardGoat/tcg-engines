import { describe, test } from "vite-plus/test";
import { op11JaguarDSaul075 } from "../../../../../cards/src/cards/OP11/characters/075-jaguar-d-saul.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-075 Jaguar.D.Saul", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11JaguarDSaul075);
  });
});
