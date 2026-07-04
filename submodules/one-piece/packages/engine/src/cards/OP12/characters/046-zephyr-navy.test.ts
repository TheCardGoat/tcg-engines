import { describe, test } from "vite-plus/test";
import { op12ZephyrNavy046 } from "../../../../../cards/src/cards/OP12/characters/046-zephyr-navy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-046 Zephyr(Navy)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12ZephyrNavy046);
  });
});
