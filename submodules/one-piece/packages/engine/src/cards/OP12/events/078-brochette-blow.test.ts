import { describe, test } from "vite-plus/test";
import { op12BrochetteBlow078 } from "../../../../../cards/src/cards/OP12/events/078-brochette-blow.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-078 Brochette Blow", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12BrochetteBlow078);
  });
});
