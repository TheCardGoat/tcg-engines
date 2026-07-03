import { describe, test } from "vite-plus/test";
import { op04Mr4Babe071 } from "../../../../../cards/src/cards/OP04/characters/071-mr-4-babe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-071 Mr.4 (Babe)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Mr4Babe071);
  });
});
