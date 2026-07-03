import { describe, test } from "vite-plus/test";
import { op14eb04ShachiPenguin006 } from "../../../../../cards/src/cards/OP14EB04/characters/006-shachi-penguin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-006 Shachi & Penguin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ShachiPenguin006);
  });
});
