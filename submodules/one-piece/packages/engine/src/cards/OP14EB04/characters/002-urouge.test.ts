import { describe, test } from "vite-plus/test";
import { op14eb04Urouge002 } from "../../../../../cards/src/cards/OP14EB04/characters/002-urouge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-002 Urouge", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Urouge002);
  });
});
