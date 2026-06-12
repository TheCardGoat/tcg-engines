import { describe, test } from "vite-plus/test";
import { op03KaidoWantedPoster003 } from "../../../../../cards/src/cards/OP03/characters/003-kaido-wanted-poster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST04-003 Kaido (Wanted Poster)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03KaidoWantedPoster003);
  });
});
