import { describe, test } from "vite-plus/test";
import { op02IceAge117 } from "../../../../../cards/src/cards/OP02/events/117-ice-age.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-117 Ice Age", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02IceAge117);
  });
});
