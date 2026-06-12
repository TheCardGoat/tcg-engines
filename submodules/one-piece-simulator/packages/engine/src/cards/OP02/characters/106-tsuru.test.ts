import { describe, test } from "vite-plus/test";
import { op02Tsuru106 } from "../../../../../cards/src/cards/OP02/characters/106-tsuru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-106 Tsuru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Tsuru106);
  });
});
