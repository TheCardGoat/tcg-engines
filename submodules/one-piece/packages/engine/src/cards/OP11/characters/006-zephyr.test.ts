import { describe, test } from "vite-plus/test";
import { op11Zephyr006 } from "../../../../../cards/src/cards/OP11/characters/006-zephyr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-006 Zephyr", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Zephyr006);
  });
});
