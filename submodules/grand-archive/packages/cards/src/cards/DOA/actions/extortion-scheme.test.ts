import { proveSuppressAction } from "../../../testing/suppress-action.ts";
import { describe } from "vitest";
import { extortionScheme } from "./extortion-scheme.ts";

/** @covers WdkZU2wwnw-a1 @covers WdkZU2wwnw-a2 */
describe("Extortion Scheme \u2014 resolution", () => {
  proveSuppressAction({
    card: extortionScheme,
    cost: 2,
    targetId: "target-1",
    optional: true,
    opponentOnly: true,
    counter: "preparation",
  });
});
