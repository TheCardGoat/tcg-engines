import { describe, test } from "vite-plus/test";
import { op14eb04Eleclaw019 } from "../../../../../cards/src/cards/OP14EB04/events/019-eleclaw.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-019 Eleclaw", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Eleclaw019);
  });
});
