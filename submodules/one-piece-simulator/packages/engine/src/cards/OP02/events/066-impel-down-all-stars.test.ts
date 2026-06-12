import { describe, test } from "vite-plus/test";
import { op02ImpelDownAllStars066 } from "../../../../../cards/src/cards/OP02/events/066-impel-down-all-stars.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-066 Impel Down All Stars", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ImpelDownAllStars066);
  });
});
