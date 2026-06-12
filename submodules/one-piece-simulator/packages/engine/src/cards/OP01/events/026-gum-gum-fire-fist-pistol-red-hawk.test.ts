import { describe, test } from "vite-plus/test";
import { op01GumGumFireFistPistolRedHawk026 } from "../../../../../cards/src/cards/OP01/events/026-gum-gum-fire-fist-pistol-red-hawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-026 Gum-Gum Fire-Fist Pistol Red Hawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01GumGumFireFistPistolRedHawk026);
  });
});
