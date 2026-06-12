import { describe, test } from "vite-plus/test";
import { op04HappinessPunch017 } from "../../../../../cards/src/cards/OP04/events/017-happiness-punch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-017 Happiness Punch", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04HappinessPunch017);
  });
});
