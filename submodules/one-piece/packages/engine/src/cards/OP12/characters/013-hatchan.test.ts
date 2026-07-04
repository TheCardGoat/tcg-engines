import { describe, test } from "vite-plus/test";
import { op12Hatchan013 } from "../../../../../cards/src/cards/OP12/characters/013-hatchan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-013 Hatchan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Hatchan013);
  });
});
