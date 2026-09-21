import { describe, test } from "vite-plus/test";
import { op01Crocodile067 } from "../../../../../cards/src/cards/characters/op01-067-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-067 Crocodile", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Crocodile067);
  });
});
