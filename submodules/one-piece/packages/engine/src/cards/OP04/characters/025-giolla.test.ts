import { describe, test } from "vite-plus/test";
import { op04Giolla025 } from "../../../../../cards/src/cards/OP04/characters/025-giolla.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-025 Giolla", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Giolla025);
  });
});
