import { describe, test } from "vite-plus/test";
import { eb01Kyros040 } from "../../../../../cards/src/cards/leaders/eb01-040-kyros.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-040 Kyros", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Kyros040);
  });
});
