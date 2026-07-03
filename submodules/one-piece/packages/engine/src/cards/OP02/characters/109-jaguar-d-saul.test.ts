import { describe, test } from "vite-plus/test";
import { op02JaguarDSaul109 } from "../../../../../cards/src/cards/OP02/characters/109-jaguar-d-saul.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-109 Jaguar.D.Saul", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02JaguarDSaul109);
  });
});
