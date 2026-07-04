import { describe, test } from "vite-plus/test";
import { op09ShachiPenguin003 } from "../../../../../cards/src/cards/OP09/characters/003-shachi-penguin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-003 Shachi & Penguin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ShachiPenguin003);
  });
});
