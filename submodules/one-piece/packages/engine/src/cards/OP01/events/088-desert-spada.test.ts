import { describe, test } from "vite-plus/test";
import { op01DesertSpada088 } from "../../../../../cards/src/cards/events/op01-088-desert-spada.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-088 Desert Spada", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01DesertSpada088);
  });
});
