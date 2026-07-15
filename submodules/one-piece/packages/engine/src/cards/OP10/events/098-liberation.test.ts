import { describe, test } from "vite-plus/test";
import { op10Liberation098 } from "../../../../../cards/src/cards/OP10/events/098-liberation.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-098 Liberation", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Liberation098);
  });
});
