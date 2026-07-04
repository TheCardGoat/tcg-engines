import { describe, test } from "vite-plus/test";
import { prb02GumGumJetGatlingReprint072 } from "../../../../../cards/src/cards/PRB02/events/072-gum-gum-jet-gatling-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-072 Gum-Gum Jet Gatling (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GumGumJetGatlingReprint072);
  });
});
