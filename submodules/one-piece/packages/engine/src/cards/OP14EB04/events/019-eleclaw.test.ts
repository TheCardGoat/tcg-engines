import { describe, test } from "vite-plus/test";
import { op14eb04Eleclaw019 } from "../../../../../cards/src/cards/events/eb04-019-eleclaw.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-019 Eleclaw", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Eleclaw019);
  });
});
