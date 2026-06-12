import { describe, test } from "vite-plus/test";
import { eb03NicoRobin055 } from "../../../../../cards/src/cards/EB03/characters/055-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-055 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03NicoRobin055);
  });
});
