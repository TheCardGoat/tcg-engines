import { describe, test } from "vite-plus/test";
import { op02GumGumRain068 } from "../../../../../cards/src/cards/OP02/events/068-gum-gum-rain.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-068 Gum-Gum Rain", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02GumGumRain068);
  });
});
