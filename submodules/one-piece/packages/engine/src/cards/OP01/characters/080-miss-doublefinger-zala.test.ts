import { describe, test } from "vite-plus/test";
import { op01MissDoublefingerZala080 } from "../../../../../cards/src/cards/characters/op01-080-miss-doublefinger-zala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-080 Miss Doublefinger(Zala)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01MissDoublefingerZala080);
  });
});
