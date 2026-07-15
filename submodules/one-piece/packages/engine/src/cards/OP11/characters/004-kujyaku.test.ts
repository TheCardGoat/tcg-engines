import { describe, test } from "vite-plus/test";
import { op11Kujyaku004 } from "../../../../../cards/src/cards/OP11/characters/004-kujyaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-004 Kujyaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Kujyaku004);
  });
});
