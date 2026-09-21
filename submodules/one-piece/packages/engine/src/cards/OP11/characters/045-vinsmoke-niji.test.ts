import { describe, test } from "vite-plus/test";
import { op11VinsmokeNiji045 } from "../../../../../cards/src/cards/characters/op11-045-vinsmoke-niji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-045 Vinsmoke Niji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VinsmokeNiji045);
  });
});
