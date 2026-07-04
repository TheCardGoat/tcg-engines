import { describe, test } from "vite-plus/test";
import { op11CharlotteDaifuku068 } from "../../../../../cards/src/cards/OP11/characters/068-charlotte-daifuku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-068 Charlotte Daifuku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteDaifuku068);
  });
});
