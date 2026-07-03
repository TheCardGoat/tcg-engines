import { describe, test } from "vite-plus/test";
import { op13StEthanbaronVNusjuro080 } from "../../../../../cards/src/cards/OP13/characters/080-st-ethanbaron-v-nusjuro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-080 St. Ethanbaron V. Nusjuro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13StEthanbaronVNusjuro080);
  });
});
