import { describe, test } from "vite-plus/test";
import { op14eb04Wadatsumi056 } from "../../../../../cards/src/cards/OP14EB04/characters/056-wadatsumi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-056 Wadatsumi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Wadatsumi056);
  });
});
