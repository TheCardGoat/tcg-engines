import { describe, test } from "vite-plus/test";
import { op07OkikuSp035 } from "../../../../../cards/src/cards/OP07/characters/035-okiku-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-035 Okiku (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07OkikuSp035);
  });
});
