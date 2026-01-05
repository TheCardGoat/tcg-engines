import { describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

// Mock $app/stores
vi.mock("$app/stores", () => ({
  page: {
    subscribe: (fn: any) => {
      fn({ url: new URL("http://localhost") });
      return () => {};
    },
  },
}));

// Mock $app/environment
vi.mock("$app/environment", () => ({
  browser: true,
}));

// Mock $app/navigation
vi.mock("$app/navigation", () => ({
  goto: vi.fn(),
}));

describe("/+page.svelte", () => {
  it("should render h1", async () => {
    const data = { cards: [] };
    render(Page, { data });

    const heading = page.getByRole("heading", { level: 1 });
    await expect.element(heading).toBeInTheDocument();
  });
});
