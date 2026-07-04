import { describe, test } from "vite-plus/test";
import { op14eb04Chambres017 } from "../../../../../cards/src/cards/OP14EB04/events/017-chambres.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-017 Chambres", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Chambres017);
  });
});
