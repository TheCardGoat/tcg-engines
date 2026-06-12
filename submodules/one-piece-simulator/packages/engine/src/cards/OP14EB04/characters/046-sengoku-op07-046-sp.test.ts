import { describe, test } from "vite-plus/test";
import { op14eb04SengokuOp07046Sp046 } from "../../../../../cards/src/cards/OP14EB04/characters/046-sengoku-op07-046-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-046 Sengoku - OP07-046 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04SengokuOp07046Sp046);
  });
});
