import { expect, test, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MantineProvider } from "@mantine/core";
import { AlphaClashPracticeSetup } from "./PracticeSetup";

test("practice setup renders without browser globals", () => {
  vi.stubGlobal("window", undefined);
  try {
    const html = renderToString(
      <MantineProvider>
        <AlphaClashPracticeSetup initialMode="self" onStart={() => {}} />
      </MantineProvider>,
    );
    expect(html).toContain("Start practice");
    expect(html).toContain("Play both sides");
    expect(html).toContain("The Absence");
  } finally {
    vi.unstubAllGlobals();
  }
});
