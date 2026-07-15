import { describe, test } from "vite-plus/test";
import { op03KiwiMozu061 } from "../../../../../cards/src/cards/OP03/characters/061-kiwi-mozu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-061 Kiwi & Mozu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03KiwiMozu061);
  });
});
