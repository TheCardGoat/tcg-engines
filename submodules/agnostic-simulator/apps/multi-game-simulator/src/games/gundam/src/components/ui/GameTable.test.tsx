// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { GameTable } from "./GameTable.tsx";

afterEach(cleanup);

describe("GameTable", () => {
  it("fills its bounded shell without growing past the viewport", () => {
    const { container } = render(<GameTable>board</GameTable>);
    const table = container.querySelector<HTMLElement>("[data-sim-board]");

    expect(table).not.toBeNull();
    expect(table!.className).toContain("h-full");
    expect(table!.className).toContain("min-h-0");
    expect(table!.className).toContain("overflow-hidden");
  });
});
