import { describe, test } from "vite-plus/test";
import { op06ZephyrNavy074 } from "../../../../../cards/src/cards/OP06/characters/074-zephyr-navy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-074 Zephyr (Navy)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06ZephyrNavy074);
  });
});
