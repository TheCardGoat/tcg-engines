import { describe, test } from "vite-plus/test";
import { eb03Kujyaku041 } from "../../../../../cards/src/cards/EB03/characters/041-kujyaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-041 Kujyaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Kujyaku041);
  });
});
