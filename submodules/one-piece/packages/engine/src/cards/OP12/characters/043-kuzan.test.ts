import { describe, test } from "vite-plus/test";
import { op12Kuzan043 } from "../../../../../cards/src/cards/OP12/characters/043-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-043 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Kuzan043);
  });
});
