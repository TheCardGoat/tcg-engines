import { describe, test } from "vite-plus/test";
import { op09NamiSp106 } from "../../../../../cards/src/cards/OP09/characters/106-nami-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-106 Nami (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NamiSp106);
  });
});
