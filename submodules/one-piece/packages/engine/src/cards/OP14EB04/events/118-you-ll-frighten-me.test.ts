import { describe, test } from "vite-plus/test";
import { op14eb04YouLlFrightenMe118 } from "../../../../../cards/src/cards/events/op14-118-you-ll-frighten-me.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-118 You'll Frighten Me...", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04YouLlFrightenMe118);
  });
});
