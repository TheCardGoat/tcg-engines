import { describe, test } from "vite-plus/test";
import { op11TopknotNeptunian107 } from "../../../../../cards/src/cards/OP11/characters/107-topknot-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-107 Topknot Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11TopknotNeptunian107);
  });
});
