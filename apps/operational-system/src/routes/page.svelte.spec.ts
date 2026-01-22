import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

describe("/+page.svelte", () => {
  it("should render the taskbar start button", async () => {
    render(Page);

    const startButton = page.getByRole("button", {
      name: "Open Command Center",
    });
    await expect.element(startButton).toBeInTheDocument();
  });
});
