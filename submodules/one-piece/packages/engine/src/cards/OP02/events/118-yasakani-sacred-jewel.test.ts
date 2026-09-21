import { describe, test } from "vite-plus/test";
import { op02YasakaniSacredJewel118 } from "../../../../../cards/src/cards/events/op02-118-yasakani-sacred-jewel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-118 Yasakani Sacred Jewel", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02YasakaniSacredJewel118);
  });
});
