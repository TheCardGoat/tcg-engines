import { describe, test } from "vite-plus/test";
import { op09NicoRobin062 } from "../../../../../cards/src/cards/leaders/op09-062-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-062 Nico Robin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NicoRobin062);
  });
});
