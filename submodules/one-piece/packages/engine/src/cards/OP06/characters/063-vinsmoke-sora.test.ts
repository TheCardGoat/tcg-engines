import { describe, test } from "vite-plus/test";
import { op06VinsmokeSora063 } from "../../../../../cards/src/cards/OP06/characters/063-vinsmoke-sora.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-063 Vinsmoke Sora", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeSora063);
  });
});
