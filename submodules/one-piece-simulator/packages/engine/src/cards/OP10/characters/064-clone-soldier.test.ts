import { describe, test } from "vite-plus/test";
import { op10CloneSoldier064 } from "../../../../../cards/src/cards/OP10/characters/064-clone-soldier.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-064 Clone Soldier", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CloneSoldier064);
  });
});
