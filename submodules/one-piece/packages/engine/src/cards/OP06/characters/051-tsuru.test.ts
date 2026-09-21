import { describe, test } from "vite-plus/test";
import { op06Tsuru051 } from "../../../../../cards/src/cards/characters/op06-051-tsuru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-051 Tsuru", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Tsuru051);
  });
});
