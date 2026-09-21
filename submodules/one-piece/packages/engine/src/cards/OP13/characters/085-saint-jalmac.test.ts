import { describe, test } from "vite-plus/test";
import { op13SaintJalmac085 } from "../../../../../cards/src/cards/characters/op13-085-saint-jalmac.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-085 Saint Jalmac", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaintJalmac085);
  });
});
