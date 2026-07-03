import { describe, test } from "vite-plus/test";
import { op03Sogeking122 } from "../../../../../cards/src/cards/OP03/characters/122-sogeking.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-122 Sogeking", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Sogeking122);
  });
});
