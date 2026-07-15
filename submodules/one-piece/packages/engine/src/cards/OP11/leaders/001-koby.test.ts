import { describe, test } from "vite-plus/test";
import { op11Koby001 } from "../../../../../cards/src/cards/OP11/leaders/001-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-001 Koby", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Koby001);
  });
});
