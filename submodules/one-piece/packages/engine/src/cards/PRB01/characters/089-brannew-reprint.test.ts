import { describe, test } from "vite-plus/test";
import { prb01BrannewReprint089 } from "../../../../../cards/src/cards/PRB01/characters/089-brannew-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-089 Brannew (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BrannewReprint089);
  });
});
