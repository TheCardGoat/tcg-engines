import { describe, test } from "vite-plus/test";
import { op11Kuzan084 } from "../../../../../cards/src/cards/OP11/characters/084-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-084 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Kuzan084);
  });
});
