import { describe, test } from "vite-plus/test";
import { op01Shinobu043 } from "../../../../../cards/src/cards/OP01/characters/043-shinobu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-043 Shinobu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Shinobu043);
  });
});
