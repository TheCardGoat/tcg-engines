import { describe, test } from "vite-plus/test";
import { op06VinsmokeNiji065 } from "../../../../../cards/src/cards/OP06/characters/065-vinsmoke-niji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-065 Vinsmoke Niji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeNiji065);
  });
});
