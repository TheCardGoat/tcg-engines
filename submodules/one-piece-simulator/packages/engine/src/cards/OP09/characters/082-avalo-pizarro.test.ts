import { describe, test } from "vite-plus/test";
import { op09AvaloPizarro082 } from "../../../../../cards/src/cards/OP09/characters/082-avalo-pizarro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-082 Avalo Pizarro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09AvaloPizarro082);
  });
});
