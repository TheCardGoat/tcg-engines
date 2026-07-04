import { describe, test } from "vite-plus/test";
import { op11GumGumKingCobra059 } from "../../../../../cards/src/cards/OP11/events/059-gum-gum-king-cobra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-059 Gum-Gum King Cobra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GumGumKingCobra059);
  });
});
