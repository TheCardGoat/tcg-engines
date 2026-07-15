import { describe, expect, it } from "bun:test";
import { chiefTuiProudOfMotunui } from "./171-chief-tui-proud-of-motunui";

describe("Chief Tui - Proud of Motunui", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(chiefTuiProudOfMotunui.vanilla).toBe(true);
    expect(chiefTuiProudOfMotunui.abilities).toBeUndefined();
  });
});
