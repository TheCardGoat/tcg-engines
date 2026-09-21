import { describe, test } from "vite-plus/test";
import { op11GumGumJetCulverin061 } from "../../../../../cards/src/cards/events/op11-061-gum-gum-jet-culverin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-061 Gum-Gum Jet Culverin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GumGumJetCulverin061);
  });
});
