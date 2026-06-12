import { describe, test } from "vite-plus/test";
import { op04LaoG034 } from "../../../../../cards/src/cards/OP04/characters/034-lao-g.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-034 Lao.G", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04LaoG034);
  });
});
