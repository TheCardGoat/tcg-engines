import { describe, test } from "vite-plus/test";
import { op04Ulti043 } from "../../../../../cards/src/cards/OP04/characters/043-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-043 Ulti", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Ulti043);
  });
});
