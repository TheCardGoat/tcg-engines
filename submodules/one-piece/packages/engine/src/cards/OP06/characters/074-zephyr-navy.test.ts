import { describe, test } from "vite-plus/test";
import { op06ZephyrNavy074 } from "../../../../../cards/src/cards/characters/op06-074-zephyr-navy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-074 Zephyr (Navy)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06ZephyrNavy074);
  });
});
