import { describe, test } from "vite-plus/test";
import { eb02Sanji054 } from "../../../../../cards/src/cards/EB02/characters/054-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-054 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sanji054);
  });
});
