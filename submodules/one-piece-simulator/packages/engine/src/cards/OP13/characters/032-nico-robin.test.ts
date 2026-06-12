import { describe, test } from "vite-plus/test";
import { op13NicoRobin032 } from "../../../../../cards/src/cards/OP13/characters/032-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-032 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13NicoRobin032);
  });
});
