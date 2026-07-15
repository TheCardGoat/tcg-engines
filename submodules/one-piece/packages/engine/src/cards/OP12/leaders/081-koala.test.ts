import { describe, test } from "vite-plus/test";
import { op12Koala081 } from "../../../../../cards/src/cards/OP12/leaders/081-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-081 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Koala081);
  });
});
