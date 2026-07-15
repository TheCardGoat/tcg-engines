import { describe, test } from "vite-plus/test";
import { eb02MonkeyDLuffy010 } from "../../../../../cards/src/cards/EB02/leaders/010-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-010 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MonkeyDLuffy010);
  });
});
