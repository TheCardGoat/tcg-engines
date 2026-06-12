import { describe, test } from "vite-plus/test";
import { op14eb04MissDoublefingerZala086 } from "../../../../../cards/src/cards/OP14EB04/characters/086-miss-doublefinger-zala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-086 Miss Doublefinger(Zala)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MissDoublefingerZala086);
  });
});
