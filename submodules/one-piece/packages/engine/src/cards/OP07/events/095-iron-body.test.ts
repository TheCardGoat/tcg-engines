import { describe, test } from "vite-plus/test";
import { op07IronBody095 } from "../../../../../cards/src/cards/events/op07-095-iron-body.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-095 Iron Body", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07IronBody095);
  });
});
