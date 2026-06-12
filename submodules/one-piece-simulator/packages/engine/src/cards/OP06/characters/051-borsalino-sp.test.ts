import { describe, test } from "vite-plus/test";
import { op06BorsalinoSp051 } from "../../../../../cards/src/cards/OP06/characters/051-borsalino-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-051 Borsalino (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BorsalinoSp051);
  });
});
