import { describe, test } from "vite-plus/test";
import { op12Hack089 } from "../../../../../cards/src/cards/OP12/characters/089-hack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-089 Hack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Hack089);
  });
});
