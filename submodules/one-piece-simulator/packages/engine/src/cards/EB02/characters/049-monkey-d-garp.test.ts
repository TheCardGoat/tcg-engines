import { describe, test } from "vite-plus/test";
import { eb02MonkeyDGarp049 } from "../../../../../cards/src/cards/EB02/characters/049-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-049 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MonkeyDGarp049);
  });
});
