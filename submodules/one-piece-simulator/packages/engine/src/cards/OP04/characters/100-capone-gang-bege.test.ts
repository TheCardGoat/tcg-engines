import { describe, test } from "vite-plus/test";
import { op04CaponeGangBege100 } from "../../../../../cards/src/cards/OP04/characters/100-capone-gang-bege.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-100 100-capone-gang-bege", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04CaponeGangBege100);
  });
});
