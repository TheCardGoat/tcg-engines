import { describe, test } from "vite-plus/test";
import { eb02ThreePaceHumSoulNotchSlash051 } from "../../../../../cards/src/cards/EB02/events/051-three-pace-hum-soul-notch-slash.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-051 Three-Pace Hum Soul Notch Slash", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02ThreePaceHumSoulNotchSlash051);
  });
});
