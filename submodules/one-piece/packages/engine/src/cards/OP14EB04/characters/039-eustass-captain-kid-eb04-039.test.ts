import { describe, test } from "vite-plus/test";
import { op14eb04EustassCaptainKidEb04039039 } from "../../../../../cards/src/cards/OP14EB04/characters/039-eustass-captain-kid-eb04-039.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-039 039-eustass-captain-kid-eb04-039", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04EustassCaptainKidEb04039039);
  });
});
