import { describe, test } from "vite-plus/test";
import { eb01KingdomCome059 } from "../../../../../cards/src/cards/events/eb01-059-kingdom-come.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-059 Kingdom Come", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01KingdomCome059);
  });
});
