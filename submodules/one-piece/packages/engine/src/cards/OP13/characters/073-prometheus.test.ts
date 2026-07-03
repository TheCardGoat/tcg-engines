import { describe, test } from "vite-plus/test";
import { op13Prometheus073 } from "../../../../../cards/src/cards/OP13/characters/073-prometheus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-073 Prometheus", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Prometheus073);
  });
});
