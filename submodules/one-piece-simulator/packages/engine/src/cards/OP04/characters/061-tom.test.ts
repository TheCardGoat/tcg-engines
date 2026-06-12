import { describe, test } from "vite-plus/test";
import { op04Tom061 } from "../../../../../cards/src/cards/OP04/characters/061-tom.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-061 Tom", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Tom061);
  });
});
