import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

describe("/+page.svelte", () => {
  it("should render the topbar search button", async () => {
    render(Page);

    const topbar = page.getByRole("navigation", { name: "Topbar" });
    const searchButton = topbar.getByRole("button", {
      name: "Open Command Center",
    });
    await expect.element(searchButton).toBeInTheDocument();
  });
});
