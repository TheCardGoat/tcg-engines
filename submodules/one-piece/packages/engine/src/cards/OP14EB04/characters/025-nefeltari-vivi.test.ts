import { describe, test } from "vite-plus/test";
import { op14eb04NefeltariVivi025 } from "../../../../../cards/src/cards/OP14EB04/characters/025-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-025 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04NefeltariVivi025);
  });
});
