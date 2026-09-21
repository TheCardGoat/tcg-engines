import { describe, test } from "vite-plus/test";
import { op02Zephyr072 } from "../../../../../cards/src/cards/leaders/op02-072-zephyr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-072 Zephyr", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Zephyr072);
  });
});
