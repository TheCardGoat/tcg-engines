import { describe, test } from "vite-plus/test";
import { op09JaguarDSaul109 } from "../../../../../cards/src/cards/OP09/characters/109-jaguar-d-saul.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-109 Jaguar.D.Saul", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09JaguarDSaul109);
  });
});
