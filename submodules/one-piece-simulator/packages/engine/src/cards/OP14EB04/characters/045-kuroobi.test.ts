import { describe, test } from "vite-plus/test";
import { op14eb04Kuroobi045 } from "../../../../../cards/src/cards/OP14EB04/characters/045-kuroobi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-045 Kuroobi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Kuroobi045);
  });
});
