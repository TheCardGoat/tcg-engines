import { describe, test } from "vite-plus/test";
import { op07ONamiSp101 } from "../../../../../cards/src/cards/OP07/characters/101-o-nami-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-101 O-Nami (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07ONamiSp101);
  });
});
