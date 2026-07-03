import { describe, test } from "vite-plus/test";
import { eb03Marguerite027 } from "../../../../../cards/src/cards/EB03/characters/027-marguerite.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-027 Marguerite", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Marguerite027);
  });
});
