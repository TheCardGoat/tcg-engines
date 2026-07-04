import { describe, test } from "vite-plus/test";
import { op04MsAllSunday064 } from "../../../../../cards/src/cards/OP04/characters/064-ms-all-sunday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-064 Ms. All Sunday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MsAllSunday064);
  });
});
