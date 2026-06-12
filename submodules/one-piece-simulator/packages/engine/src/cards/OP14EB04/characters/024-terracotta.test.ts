import { describe, test } from "vite-plus/test";
import { op14eb04Terracotta024 } from "../../../../../cards/src/cards/OP14EB04/characters/024-terracotta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-024 Terracotta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Terracotta024);
  });
});
