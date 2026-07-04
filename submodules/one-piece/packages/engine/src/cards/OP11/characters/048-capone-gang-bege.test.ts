import { describe, test } from "vite-plus/test";
import { op11CaponeGangBege048 } from "../../../../../cards/src/cards/OP11/characters/048-capone-gang-bege.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-048 048-capone-gang-bege", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CaponeGangBege048);
  });
});
