import { describe, test } from "vite-plus/test";
import { op14eb04Chambres017 } from "../../../../../cards/src/cards/events/op14-017-chambres.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-017 Chambres", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Chambres017);
  });
});
