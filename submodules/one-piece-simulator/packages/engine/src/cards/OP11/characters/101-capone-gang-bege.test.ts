import { describe, test } from "vite-plus/test";
import { op11CaponeGangBege101 } from "../../../../../cards/src/cards/OP11/characters/101-capone-gang-bege.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-101 101-capone-gang-bege", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CaponeGangBege101);
  });
});
