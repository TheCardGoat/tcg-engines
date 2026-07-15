import { describe, test } from "vite-plus/test";
import { op10NicoRobin089 } from "../../../../../cards/src/cards/OP10/characters/089-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-089 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10NicoRobin089);
  });
});
