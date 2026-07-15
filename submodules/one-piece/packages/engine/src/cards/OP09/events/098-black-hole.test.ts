import { describe, test } from "vite-plus/test";
import { op09BlackHole098 } from "../../../../../cards/src/cards/OP09/events/098-black-hole.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-098 Black Hole", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BlackHole098);
  });
});
