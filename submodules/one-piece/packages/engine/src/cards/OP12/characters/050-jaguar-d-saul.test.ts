import { describe, test } from "vite-plus/test";
import { op12JaguarDSaul050 } from "../../../../../cards/src/cards/OP12/characters/050-jaguar-d-saul.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-050 Jaguar.D.Saul", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12JaguarDSaul050);
  });
});
