import { describe, test } from "vite-plus/test";
import { op01Killer039 } from "../../../../../cards/src/cards/OP01/characters/039-killer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-039 Killer", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Killer039);
  });
});
