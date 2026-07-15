import { describe, test } from "vite-plus/test";
import { op11LittleSadi063 } from "../../../../../cards/src/cards/OP11/characters/063-little-sadi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-063 Little Sadi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LittleSadi063);
  });
});
