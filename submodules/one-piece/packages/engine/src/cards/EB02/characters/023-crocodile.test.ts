import { describe, test } from "vite-plus/test";
import { eb02Crocodile023 } from "../../../../../cards/src/cards/EB02/characters/023-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-023 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Crocodile023);
  });
});
