import { describe, test } from "vite-plus/test";
import { op04DonquixoteFamily036 } from "../../../../../cards/src/cards/events/op04-036-donquixote-family.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-036 Donquixote Family", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DonquixoteFamily036);
  });
});
