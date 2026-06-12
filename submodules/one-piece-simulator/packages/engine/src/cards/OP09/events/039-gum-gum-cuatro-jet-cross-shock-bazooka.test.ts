import { describe, test } from "vite-plus/test";
import { op09GumGumCuatroJetCrossShockBazooka039 } from "../../../../../cards/src/cards/OP09/events/039-gum-gum-cuatro-jet-cross-shock-bazooka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-039 Gum-Gum Cuatro Jet Cross Shock Bazooka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GumGumCuatroJetCrossShockBazooka039);
  });
});
