import { describe, test } from "vite-plus/test";
import { op03SanjiSPilaf056 } from "../../../../../cards/src/cards/OP03/events/056-sanji-s-pilaf.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-056 Sanji's Pilaf", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03SanjiSPilaf056);
  });
});
