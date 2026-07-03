import { describe, test } from "vite-plus/test";
import { op10GumGumDragonFirePistolTwisterStar039 } from "../../../../../cards/src/cards/OP10/events/039-gum-gum-dragon-fire-pistol-twister-star.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-039 Gum-Gum Dragon Fire Pistol Twister Star", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10GumGumDragonFirePistolTwisterStar039);
  });
});
