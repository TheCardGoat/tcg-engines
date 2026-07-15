import { describe, test } from "vite-plus/test";
import { op13StTopmanWarcury089 } from "../../../../../cards/src/cards/OP13/characters/089-st-topman-warcury.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-089 St. Topman Warcury", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13StTopmanWarcury089);
  });
});
