import { describe, test } from "vite-plus/test";
import { op06Shiki073 } from "../../../../../cards/src/cards/OP06/characters/073-shiki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-073 Shiki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Shiki073);
  });
});
