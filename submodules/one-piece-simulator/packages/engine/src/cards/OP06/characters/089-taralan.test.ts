import { describe, test } from "vite-plus/test";
import { op06Taralan089 } from "../../../../../cards/src/cards/OP06/characters/089-taralan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-089 Taralan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Taralan089);
  });
});
