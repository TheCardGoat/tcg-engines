import { describe, test } from "vite-plus/test";
import { op11Koby001 } from "../../../../../cards/src/cards/leaders/op11-001-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-001 Koby", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Koby001);
  });
});
