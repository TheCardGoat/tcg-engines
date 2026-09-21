import { describe, test } from "vite-plus/test";
import { op04Rokki054 } from "../../../../../cards/src/cards/characters/op04-054-rokki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-054 Rokki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Rokki054);
  });
});
