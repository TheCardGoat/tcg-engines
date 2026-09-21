import { describe, test } from "vite-plus/test";
import { op10Liberation098 } from "../../../../../cards/src/cards/events/op10-098-liberation.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-098 Liberation", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Liberation098);
  });
});
