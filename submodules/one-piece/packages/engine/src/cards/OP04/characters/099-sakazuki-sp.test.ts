import { describe, test } from "vite-plus/test";
import { op04SakazukiSp099 } from "../../../../../cards/src/cards/OP04/characters/099-sakazuki-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-099 Sakazuki (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04SakazukiSp099);
  });
});
