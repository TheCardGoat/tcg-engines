import { describe, test } from "vite-plus/test";
import { op03ThreeThousandWorlds057 } from "../../../../../cards/src/cards/OP03/events/057-three-thousand-worlds.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-057 Three Thousand Worlds", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03ThreeThousandWorlds057);
  });
});
