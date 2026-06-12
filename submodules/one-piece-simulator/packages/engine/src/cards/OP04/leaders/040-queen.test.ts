import { describe, test } from "vite-plus/test";
import { op04Queen040 } from "../../../../../cards/src/cards/OP04/leaders/040-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-040 Queen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Queen040);
  });
});
