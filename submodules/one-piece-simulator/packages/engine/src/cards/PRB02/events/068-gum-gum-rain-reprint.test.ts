import { describe, test } from "vite-plus/test";
import { prb02GumGumRainReprint068 } from "../../../../../cards/src/cards/PRB02/events/068-gum-gum-rain-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-068 Gum-Gum Rain (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GumGumRainReprint068);
  });
});
