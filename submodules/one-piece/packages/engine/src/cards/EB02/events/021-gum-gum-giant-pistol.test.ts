import { describe, test } from "vite-plus/test";
import { eb02GumGumGiantPistol021 } from "../../../../../cards/src/cards/events/eb02-021-gum-gum-giant-pistol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-021 Gum-Gum Giant Pistol", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02GumGumGiantPistol021);
  });
});
