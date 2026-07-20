// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { useLayoutMode } from "./use-layout-mode.ts";

function Probe() {
  return <span>{useLayoutMode()}</span>;
}

afterEach(cleanup);

describe("useLayoutMode", () => {
  it("keeps a short-height phone landscape in the mobile layout", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 844 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 390 });

    render(<Probe />);

    await waitFor(() => expect(screen.getByText("mobile")).not.toBeNull());
  });
});
