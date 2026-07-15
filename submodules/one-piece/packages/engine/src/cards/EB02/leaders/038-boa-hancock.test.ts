import { describe, test } from "vite-plus/test";
import { eb02BoaHancock038 } from "../../../../../cards/src/cards/EB02/leaders/038-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-038 Boa Hancock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02BoaHancock038);
  });
});
