import { describe, test } from "vite-plus/test";
import { op10Rock017 } from "../../../../../cards/src/cards/OP10/characters/017-rock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-017 Rock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Rock017);
  });
});
