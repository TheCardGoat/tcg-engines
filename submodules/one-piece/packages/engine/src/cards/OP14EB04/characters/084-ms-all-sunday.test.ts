import { describe, test } from "vite-plus/test";
import { op14eb04MsAllSunday084 } from "../../../../../cards/src/cards/OP14EB04/characters/084-ms-all-sunday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-084 Ms. All Sunday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MsAllSunday084);
  });
});
