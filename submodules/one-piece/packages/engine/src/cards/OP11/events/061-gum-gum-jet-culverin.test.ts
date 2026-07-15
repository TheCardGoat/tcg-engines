import { describe, test } from "vite-plus/test";
import { op11GumGumJetCulverin061 } from "../../../../../cards/src/cards/OP11/events/061-gum-gum-jet-culverin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-061 Gum-Gum Jet Culverin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GumGumJetCulverin061);
  });
});
