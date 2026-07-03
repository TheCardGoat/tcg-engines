import { describe, test } from "vite-plus/test";
import { op09Wire017 } from "../../../../../cards/src/cards/OP09/characters/017-wire.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-017 Wire", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Wire017);
  });
});
