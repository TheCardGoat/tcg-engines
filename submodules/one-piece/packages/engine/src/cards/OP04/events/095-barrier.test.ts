import { describe, test } from "vite-plus/test";
import { op04Barrier095 } from "../../../../../cards/src/cards/OP04/events/095-barrier.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-095 Barrier!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Barrier095);
  });
});
