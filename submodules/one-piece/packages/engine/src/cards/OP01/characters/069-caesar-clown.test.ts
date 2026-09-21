import { describe, test } from "vite-plus/test";
import { op01CaesarClown069 } from "../../../../../cards/src/cards/characters/op01-069-caesar-clown.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-069 Caesar Clown", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01CaesarClown069);
  });
});
