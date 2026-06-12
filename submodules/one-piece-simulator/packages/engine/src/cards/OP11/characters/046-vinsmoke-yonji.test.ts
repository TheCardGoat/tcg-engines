import { describe, test } from "vite-plus/test";
import { op11VinsmokeYonji046 } from "../../../../../cards/src/cards/OP11/characters/046-vinsmoke-yonji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-046 Vinsmoke Yonji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VinsmokeYonji046);
  });
});
