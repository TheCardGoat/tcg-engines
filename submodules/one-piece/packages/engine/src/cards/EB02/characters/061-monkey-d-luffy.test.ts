import { describe, test } from "vite-plus/test";
import { eb02MonkeyDLuffy061 } from "../../../../../cards/src/cards/EB02/characters/061-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-061 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MonkeyDLuffy061);
  });
});
