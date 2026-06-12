import { describe, test } from "vite-plus/test";
import { op02GeckoMoria054 } from "../../../../../cards/src/cards/OP02/characters/054-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-054 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02GeckoMoria054);
  });
});
