import { describe, test } from "vite-plus/test";
import { op14eb04Machvise073 } from "../../../../../cards/src/cards/OP14EB04/characters/073-machvise.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-073 Machvise", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Machvise073);
  });
});
