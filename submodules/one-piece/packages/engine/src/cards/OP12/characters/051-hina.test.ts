import { describe, test } from "vite-plus/test";
import { op12Hina051 } from "../../../../../cards/src/cards/characters/op12-051-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-051 Hina", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Hina051);
  });
});
