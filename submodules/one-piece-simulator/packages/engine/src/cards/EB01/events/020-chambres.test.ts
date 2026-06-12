import { describe, test } from "vite-plus/test";
import { eb01Chambres020 } from "../../../../../cards/src/cards/EB01/events/020-chambres.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-020 Chambres", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Chambres020);
  });
});
