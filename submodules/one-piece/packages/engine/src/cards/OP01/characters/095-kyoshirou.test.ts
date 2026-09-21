import { describe, test } from "vite-plus/test";
import { op01Kyoshirou095 } from "../../../../../cards/src/cards/characters/op01-095-kyoshirou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-095 Kyoshirou", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kyoshirou095);
  });
});
