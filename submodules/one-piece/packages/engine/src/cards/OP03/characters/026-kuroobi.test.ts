import { describe, test } from "vite-plus/test";
import { op03Kuroobi026 } from "../../../../../cards/src/cards/OP03/characters/026-kuroobi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-026 Kuroobi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kuroobi026);
  });
});
