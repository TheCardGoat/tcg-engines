import { describe, test } from "vite-plus/test";
import { eb02FakeStrawHatCrew005 } from "../../../../../cards/src/cards/EB02/characters/005-fake-straw-hat-crew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-005 Fake Straw Hat Crew", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02FakeStrawHatCrew005);
  });
});
