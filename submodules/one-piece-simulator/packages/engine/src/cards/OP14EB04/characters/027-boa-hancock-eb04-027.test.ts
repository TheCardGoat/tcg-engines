import { describe, test } from "vite-plus/test";
import { op14eb04BoaHancockEb04027027 } from "../../../../../cards/src/cards/OP14EB04/characters/027-boa-hancock-eb04-027.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-027 Boa Hancock - EB04-027", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BoaHancockEb04027027);
  });
});
