import { describe, test } from "vite-plus/test";
import { op06JaguarDSaul053 } from "../../../../../cards/src/cards/OP06/characters/053-jaguar-d-saul.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-053 Jaguar.D.Saul", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06JaguarDSaul053);
  });
});
