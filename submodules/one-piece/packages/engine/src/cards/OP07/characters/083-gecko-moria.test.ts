import { describe, test } from "vite-plus/test";
import { op07GeckoMoria083 } from "../../../../../cards/src/cards/OP07/characters/083-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-083 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07GeckoMoria083);
  });
});
