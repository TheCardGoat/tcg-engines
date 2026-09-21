import { describe, test } from "vite-plus/test";
import { op11GlorpWeb019 } from "../../../../../cards/src/cards/events/op11-019-glorp-web.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-019 Glorp Web!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GlorpWeb019);
  });
});
