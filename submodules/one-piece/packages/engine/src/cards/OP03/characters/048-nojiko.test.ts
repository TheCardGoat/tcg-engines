import { describe, test } from "vite-plus/test";
import { op03Nojiko048 } from "../../../../../cards/src/cards/characters/op03-048-nojiko.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-048 Nojiko", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Nojiko048);
  });
});
