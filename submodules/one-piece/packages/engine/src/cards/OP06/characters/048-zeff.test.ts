import { describe, test } from "vite-plus/test";
import { op06Zeff048 } from "../../../../../cards/src/cards/OP06/characters/048-zeff.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-048 Zeff", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Zeff048);
  });
});
