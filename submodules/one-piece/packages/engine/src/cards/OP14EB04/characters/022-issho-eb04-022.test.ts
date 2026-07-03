import { describe, test } from "vite-plus/test";
import { op14eb04IsshoEb04022022 } from "../../../../../cards/src/cards/OP14EB04/characters/022-issho-eb04-022.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-022 Issho - EB04-022", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04IsshoEb04022022);
  });
});
