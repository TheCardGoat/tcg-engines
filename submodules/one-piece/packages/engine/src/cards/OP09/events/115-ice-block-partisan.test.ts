import { describe, test } from "vite-plus/test";
import { op09IceBlockPartisan115 } from "../../../../../cards/src/cards/OP09/events/115-ice-block-partisan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-115 Ice Block Partisan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09IceBlockPartisan115);
  });
});
