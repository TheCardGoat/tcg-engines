import { describe, test } from "vite-plus/test";
import { eb02NicoRobin036 } from "../../../../../cards/src/cards/EB02/characters/036-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-036 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02NicoRobin036);
  });
});
