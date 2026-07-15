import { describe, test } from "vite-plus/test";
import { op03MonkeyDLuffyWantedPoster012 } from "../../../../../cards/src/cards/OP03/characters/012-monkey-d-luffy-wanted-poster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST01-012 Monkey.D.Luffy (Wanted Poster)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03MonkeyDLuffyWantedPoster012);
  });
});
