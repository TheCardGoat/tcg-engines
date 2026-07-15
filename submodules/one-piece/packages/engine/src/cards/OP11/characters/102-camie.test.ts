import { describe, test } from "vite-plus/test";
import { op11Camie102 } from "../../../../../cards/src/cards/OP11/characters/102-camie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-102 Camie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Camie102);
  });
});
