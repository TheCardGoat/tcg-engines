import { describe, test } from "vite-plus/test";
import { op03Nojiko048 } from "../../../../../cards/src/cards/OP03/characters/048-nojiko.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-048 Nojiko", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Nojiko048);
  });
});
