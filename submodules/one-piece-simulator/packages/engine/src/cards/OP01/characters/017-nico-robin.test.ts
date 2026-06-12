import { describe, test } from "vite-plus/test";
import { op01NicoRobin017 } from "../../../../../cards/src/cards/OP01/characters/017-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-017 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01NicoRobin017);
  });
});
