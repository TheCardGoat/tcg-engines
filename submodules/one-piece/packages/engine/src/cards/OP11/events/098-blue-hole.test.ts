import { describe, test } from "vite-plus/test";
import { op11BlueHole098 } from "../../../../../cards/src/cards/OP11/events/098-blue-hole.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-098 Blue Hole", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11BlueHole098);
  });
});
