import { describe, test } from "vite-plus/test";
import { op03UsoppSRubberBandOfDoom054 } from "../../../../../cards/src/cards/events/op03-054-usopp-s-rubber-band-of-doom.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-054 Usopp's Rubber Band of Doom!!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03UsoppSRubberBandOfDoom054);
  });
});
