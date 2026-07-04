import { describe, test } from "vite-plus/test";
import { op04Koza006 } from "../../../../../cards/src/cards/OP04/characters/006-koza.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-006 Koza", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Koza006);
  });
});
