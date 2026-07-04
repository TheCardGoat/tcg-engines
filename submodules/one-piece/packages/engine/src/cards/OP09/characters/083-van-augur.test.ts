import { describe, test } from "vite-plus/test";
import { op09VanAugur083 } from "../../../../../cards/src/cards/OP09/characters/083-van-augur.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-083 Van Augur", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09VanAugur083);
  });
});
