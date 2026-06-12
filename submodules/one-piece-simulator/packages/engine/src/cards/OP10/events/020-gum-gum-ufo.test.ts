import { describe, test } from "vite-plus/test";
import { op10GumGumUfo020 } from "../../../../../cards/src/cards/OP10/events/020-gum-gum-ufo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-020 Gum-Gum UFO", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10GumGumUfo020);
  });
});
