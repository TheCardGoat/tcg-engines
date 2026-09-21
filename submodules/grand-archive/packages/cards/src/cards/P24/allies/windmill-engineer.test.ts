import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { windmillEngineer } from "./windmill-engineer.ts";

/** @covers fz1nr5a3pm-a1 */
describe("Windmill Engineer — Imbue keyword", () => {
  proveImbueKeyword({
    card: windmillEngineer,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
