import { describe, test } from "vite-plus/test";
import { eb01MountainGod018 } from "../../../../../cards/src/cards/characters/eb01-018-mountain-god.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-018 Mountain God", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MountainGod018);
  });
});
