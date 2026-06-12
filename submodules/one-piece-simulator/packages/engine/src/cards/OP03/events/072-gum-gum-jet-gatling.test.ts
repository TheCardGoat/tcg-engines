import { describe, test } from "vite-plus/test";
import { op03GumGumJetGatling072 } from "../../../../../cards/src/cards/OP03/events/072-gum-gum-jet-gatling.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-072 Gum-Gum Jet Gatling", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03GumGumJetGatling072);
  });
});
