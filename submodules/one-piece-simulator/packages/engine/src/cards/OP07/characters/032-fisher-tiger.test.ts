import { describe, test } from "vite-plus/test";
import { op07FisherTiger032 } from "../../../../../cards/src/cards/OP07/characters/032-fisher-tiger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-032 Fisher Tiger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07FisherTiger032);
  });
});
