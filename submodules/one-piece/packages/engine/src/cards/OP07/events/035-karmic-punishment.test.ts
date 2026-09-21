import { describe, test } from "vite-plus/test";
import { op07KarmicPunishment035 } from "../../../../../cards/src/cards/events/op07-035-karmic-punishment.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-035 Karmic Punishment", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07KarmicPunishment035);
  });
});
