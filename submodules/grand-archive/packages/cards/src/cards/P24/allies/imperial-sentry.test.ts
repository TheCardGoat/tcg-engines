import { describe } from "vitest";
import { imperialSentry } from "./imperial-sentry.ts";
import { proveClassIntercept } from "../../../testing/class-intercept.ts";
/** @covers plywc08c9h-a1 */
describe("imperial-sentry — Class Bonus Intercept", () =>
  proveClassIntercept(imperialSentry, "plywc08c9h-a1"));
