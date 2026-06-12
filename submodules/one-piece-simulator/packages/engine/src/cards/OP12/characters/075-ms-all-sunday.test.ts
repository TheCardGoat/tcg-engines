import { describe, test } from "vite-plus/test";
import { op12MsAllSunday075 } from "../../../../../cards/src/cards/OP12/characters/075-ms-all-sunday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-075 Ms. All Sunday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12MsAllSunday075);
  });
});
