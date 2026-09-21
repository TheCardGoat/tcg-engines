import { describe, test } from "vite-plus/test";
import { eb02ThePeak008 } from "../../../../../cards/src/cards/events/eb02-008-the-peak.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-008 The Peak", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02ThePeak008);
  });
});
