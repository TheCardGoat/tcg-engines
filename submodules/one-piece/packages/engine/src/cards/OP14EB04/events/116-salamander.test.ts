import { describe, test } from "vite-plus/test";
import { op14eb04Salamander116 } from "../../../../../cards/src/cards/OP14EB04/events/116-salamander.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-116 Salamander", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Salamander116);
  });
});
