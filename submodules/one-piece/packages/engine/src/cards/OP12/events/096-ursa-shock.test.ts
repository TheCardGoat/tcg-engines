import { describe, test } from "vite-plus/test";
import { op12UrsaShock096 } from "../../../../../cards/src/cards/OP12/events/096-ursa-shock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-096 Ursa Shock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12UrsaShock096);
  });
});
