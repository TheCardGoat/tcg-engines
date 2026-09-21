import { describe, test } from "vite-plus/test";
import { op10GumGumUfo020 } from "../../../../../cards/src/cards/events/op10-020-gum-gum-ufo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-020 Gum-Gum UFO", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10GumGumUfo020);
  });
});
