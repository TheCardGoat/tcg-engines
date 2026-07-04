import { describe, test } from "vite-plus/test";
import { op06BuggySp008 } from "../../../../../cards/src/cards/OP06/characters/008-buggy-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-008 Buggy (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BuggySp008);
  });
});
