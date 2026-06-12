import { describe, test } from "vite-plus/test";
import { op10Killer106 } from "../../../../../cards/src/cards/OP10/characters/106-killer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-106 Killer", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Killer106);
  });
});
