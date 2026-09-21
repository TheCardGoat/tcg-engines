import { describe, test } from "vite-plus/test";
import { op04Sabo083 } from "../../../../../cards/src/cards/characters/op04-083-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-083 Sabo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Sabo083);
  });
});
