import { describe, test } from "vite-plus/test";
import { op10CaponeGangBege103 } from "../../../../../cards/src/cards/OP10/characters/103-capone-gang-bege.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-103 103-capone-gang-bege", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CaponeGangBege103);
  });
});
