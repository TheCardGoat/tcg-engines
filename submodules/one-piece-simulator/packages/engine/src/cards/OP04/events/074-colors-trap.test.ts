import { describe, test } from "vite-plus/test";
import { op04ColorsTrap074 } from "../../../../../cards/src/cards/OP04/events/074-colors-trap.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-074 Colors Trap", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04ColorsTrap074);
  });
});
