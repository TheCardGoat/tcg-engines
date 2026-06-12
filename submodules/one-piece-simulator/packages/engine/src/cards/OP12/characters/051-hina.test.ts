import { describe, test } from "vite-plus/test";
import { op12Hina051 } from "../../../../../cards/src/cards/OP12/characters/051-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-051 Hina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Hina051);
  });
});
