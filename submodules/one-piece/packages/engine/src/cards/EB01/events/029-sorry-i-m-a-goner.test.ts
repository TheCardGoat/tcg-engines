import { describe, test } from "vite-plus/test";
import { eb01SorryIMAGoner029 } from "../../../../../cards/src/cards/EB01/events/029-sorry-i-m-a-goner.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-029 Sorry. I'm a Goner.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01SorryIMAGoner029);
  });
});
