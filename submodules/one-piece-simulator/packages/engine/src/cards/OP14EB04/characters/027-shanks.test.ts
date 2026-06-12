import { describe, test } from "vite-plus/test";
import { op14eb04Shanks027 } from "../../../../../cards/src/cards/OP14EB04/characters/027-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-027 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Shanks027);
  });
});
