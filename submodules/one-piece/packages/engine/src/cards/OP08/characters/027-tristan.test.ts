import { describe, test } from "vite-plus/test";
import { op08Tristan027 } from "../../../../../cards/src/cards/OP08/characters/027-tristan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-027 Tristan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Tristan027);
  });
});
