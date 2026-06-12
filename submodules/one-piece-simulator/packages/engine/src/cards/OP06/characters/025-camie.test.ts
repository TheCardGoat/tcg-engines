import { describe, test } from "vite-plus/test";
import { op06Camie025 } from "../../../../../cards/src/cards/OP06/characters/025-camie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-025 Camie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Camie025);
  });
});
