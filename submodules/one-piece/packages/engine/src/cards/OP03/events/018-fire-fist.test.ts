import { describe, test } from "vite-plus/test";
import { op03FireFist018 } from "../../../../../cards/src/cards/events/op03-018-fire-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-018 Fire Fist", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03FireFist018);
  });
});
