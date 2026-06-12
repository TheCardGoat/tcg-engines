import { describe, test } from "vite-plus/test";
import { op02Seaquake021 } from "../../../../../cards/src/cards/OP02/events/021-seaquake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-021 Seaquake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Seaquake021);
  });
});
