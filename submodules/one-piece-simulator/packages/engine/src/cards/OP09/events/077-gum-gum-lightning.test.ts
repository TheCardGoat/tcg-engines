import { describe, test } from "vite-plus/test";
import { op09GumGumLightning077 } from "../../../../../cards/src/cards/OP09/events/077-gum-gum-lightning.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-077 Gum-Gum Lightning", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GumGumLightning077);
  });
});
