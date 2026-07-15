import { describe, test } from "vite-plus/test";
import { op12Pacifista109 } from "../../../../../cards/src/cards/OP12/characters/109-pacifista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-109 Pacifista", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Pacifista109);
  });
});
