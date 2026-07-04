import { describe, test } from "vite-plus/test";
import { eb02Vegapunk056 } from "../../../../../cards/src/cards/EB02/characters/056-vegapunk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-056 Vegapunk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Vegapunk056);
  });
});
