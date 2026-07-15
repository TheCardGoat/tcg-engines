import { describe, test } from "vite-plus/test";
import { op07KarmicPunishment035 } from "../../../../../cards/src/cards/OP07/events/035-karmic-punishment.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-035 Karmic Punishment", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07KarmicPunishment035);
  });
});
