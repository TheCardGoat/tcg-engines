import { describe, test } from "vite-plus/test";
import { eb02Iceburg032 } from "../../../../../cards/src/cards/EB02/characters/032-iceburg.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-032 Iceburg", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Iceburg032);
  });
});
