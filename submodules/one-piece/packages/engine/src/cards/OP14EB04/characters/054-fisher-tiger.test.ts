import { describe, test } from "vite-plus/test";
import { op14eb04FisherTiger054 } from "../../../../../cards/src/cards/OP14EB04/characters/054-fisher-tiger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-054 Fisher Tiger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04FisherTiger054);
  });
});
