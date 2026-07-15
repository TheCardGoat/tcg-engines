import { describe, test } from "vite-plus/test";
import { op04KungFuJugon005 } from "../../../../../cards/src/cards/OP04/characters/005-kung-fu-jugon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-005 Kung Fu Jugon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04KungFuJugon005);
  });
});
