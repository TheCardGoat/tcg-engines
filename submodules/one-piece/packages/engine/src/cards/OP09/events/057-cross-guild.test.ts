import { describe, test } from "vite-plus/test";
import { op09CrossGuild057 } from "../../../../../cards/src/cards/events/op09-057-cross-guild.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-057 Cross Guild", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09CrossGuild057);
  });
});
