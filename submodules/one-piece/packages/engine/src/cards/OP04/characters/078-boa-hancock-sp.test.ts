import { describe, test } from "vite-plus/test";
import { op04BoaHancockSp078 } from "../../../../../cards/src/cards/OP04/characters/078-boa-hancock-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-078 Boa Hancock (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04BoaHancockSp078);
  });
});
