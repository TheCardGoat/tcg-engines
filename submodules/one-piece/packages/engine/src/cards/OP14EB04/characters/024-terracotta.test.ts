import { describe, test } from "vite-plus/test";
import { op14eb04Terracotta024 } from "../../../../../cards/src/cards/characters/eb04-024-terracotta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-024 Terracotta", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Terracotta024);
  });
});
