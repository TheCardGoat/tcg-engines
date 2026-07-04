import { describe, test } from "vite-plus/test";
import { op06VinsmokeNiji064 } from "../../../../../cards/src/cards/OP06/characters/064-vinsmoke-niji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-064 Vinsmoke Niji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeNiji064);
  });
});
