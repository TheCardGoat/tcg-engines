import { describe, test } from "vite-plus/test";
import { op11FisherTiger035 } from "../../../../../cards/src/cards/OP11/characters/035-fisher-tiger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-035 Fisher Tiger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11FisherTiger035);
  });
});
