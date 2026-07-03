import { describe, test } from "vite-plus/test";
import { op07IzoSp003 } from "../../../../../cards/src/cards/OP07/characters/003-izo-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-003 Izo (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07IzoSp003);
  });
});
