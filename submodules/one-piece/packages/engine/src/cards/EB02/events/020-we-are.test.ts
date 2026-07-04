import { describe, test } from "vite-plus/test";
import { eb02WeAre020 } from "../../../../../cards/src/cards/EB02/events/020-we-are.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-020 We Are!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02WeAre020);
  });
});
