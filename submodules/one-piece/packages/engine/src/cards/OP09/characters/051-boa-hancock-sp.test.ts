import { describe, test } from "vite-plus/test";
import { op09BoaHancockSp051 } from "../../../../../cards/src/cards/OP09/characters/051-boa-hancock-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-051 Boa Hancock (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BoaHancockSp051);
  });
});
