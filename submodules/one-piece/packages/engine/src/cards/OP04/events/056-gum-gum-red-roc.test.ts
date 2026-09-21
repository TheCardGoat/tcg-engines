import { describe, test } from "vite-plus/test";
import { op04GumGumRedRoc056 } from "../../../../../cards/src/cards/events/op04-056-gum-gum-red-roc.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-056 Gum-Gum Red Roc", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04GumGumRedRoc056);
  });
});
