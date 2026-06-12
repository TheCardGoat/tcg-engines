import { describe, test } from "vite-plus/test";
import { op14eb04Killer005 } from "../../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-005 Killer", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Killer005);
  });
});
