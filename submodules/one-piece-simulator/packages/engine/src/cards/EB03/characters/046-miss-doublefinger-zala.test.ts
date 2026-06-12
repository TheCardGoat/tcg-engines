import { describe, test } from "vite-plus/test";
import { eb03MissDoublefingerZala046 } from "../../../../../cards/src/cards/EB03/characters/046-miss-doublefinger-zala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-046 Miss Doublefinger(Zala)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03MissDoublefingerZala046);
  });
});
