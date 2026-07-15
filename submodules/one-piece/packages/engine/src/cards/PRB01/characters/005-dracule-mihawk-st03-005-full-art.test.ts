import { describe, test } from "vite-plus/test";
import { prb01DraculeMihawkSt03005FullArt005 } from "../../../../../cards/src/cards/PRB01/characters/005-dracule-mihawk-st03-005-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST03-005 Dracule Mihawk (ST03-005) (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01DraculeMihawkSt03005FullArt005);
  });
});
