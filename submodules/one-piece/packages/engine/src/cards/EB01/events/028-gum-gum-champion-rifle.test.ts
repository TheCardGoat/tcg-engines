import { describe, test } from "vite-plus/test";
import { eb01GumGumChampionRifle028 } from "../../../../../cards/src/cards/EB01/events/028-gum-gum-champion-rifle.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-028 Gum-Gum Champion Rifle", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01GumGumChampionRifle028);
  });
});
