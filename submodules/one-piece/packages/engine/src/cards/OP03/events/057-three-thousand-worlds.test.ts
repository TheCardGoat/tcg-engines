import { describe, test } from "vite-plus/test";
import { op03ThreeThousandWorlds057 } from "../../../../../cards/src/cards/events/op03-057-three-thousand-worlds.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-057 Three Thousand Worlds", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03ThreeThousandWorlds057);
  });
});
