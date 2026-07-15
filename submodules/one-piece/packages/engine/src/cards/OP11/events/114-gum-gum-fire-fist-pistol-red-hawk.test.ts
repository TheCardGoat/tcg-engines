import { describe, test } from "vite-plus/test";
import { op11GumGumFireFistPistolRedHawk114 } from "../../../../../cards/src/cards/OP11/events/114-gum-gum-fire-fist-pistol-red-hawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-114 Gum-Gum Fire-Fist Pistol Red Hawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GumGumFireFistPistolRedHawk114);
  });
});
