import { describe, test } from "vite-plus/test";
import { op14eb04CaponeGangBege003 } from "../../../../../cards/src/cards/OP14EB04/characters/003-capone-gang-bege.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-003 003-capone-gang-bege", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04CaponeGangBege003);
  });
});
