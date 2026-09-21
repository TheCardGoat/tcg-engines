import { describe, test } from "vite-plus/test";
import { op14eb04GroggyMonsters033 } from "../../../../../cards/src/cards/characters/eb04-033-groggy-monsters.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-033 Groggy Monsters", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04GroggyMonsters033);
  });
});
