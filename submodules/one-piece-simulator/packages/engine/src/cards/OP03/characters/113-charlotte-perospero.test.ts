import { describe, test } from "vite-plus/test";
import { op03CharlottePerospero113 } from "../../../../../cards/src/cards/OP03/characters/113-charlotte-perospero.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-113 Charlotte Perospero", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlottePerospero113);
  });
});
