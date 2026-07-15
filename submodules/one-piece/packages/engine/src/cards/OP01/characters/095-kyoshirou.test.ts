import { describe, test } from "vite-plus/test";
import { op01Kyoshirou095 } from "../../../../../cards/src/cards/OP01/characters/095-kyoshirou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-095 Kyoshirou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kyoshirou095);
  });
});
