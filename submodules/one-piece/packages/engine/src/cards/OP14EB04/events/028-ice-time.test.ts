import { describe, test } from "vite-plus/test";
import { op14eb04IceTime028 } from "../../../../../cards/src/cards/events/eb04-028-ice-time.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-028 Ice Time", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04IceTime028);
  });
});
