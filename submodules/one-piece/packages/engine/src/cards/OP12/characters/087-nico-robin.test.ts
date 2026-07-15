import { describe, test } from "vite-plus/test";
import { op12NicoRobin087 } from "../../../../../cards/src/cards/OP12/characters/087-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-087 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12NicoRobin087);
  });
});
