import { describe, test } from "vite-plus/test";
import { op11VinsmokeReiju047 } from "../../../../../cards/src/cards/OP11/characters/047-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-047 Vinsmoke Reiju", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VinsmokeReiju047);
  });
});
