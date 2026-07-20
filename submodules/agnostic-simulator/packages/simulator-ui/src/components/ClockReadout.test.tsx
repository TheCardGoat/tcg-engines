import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { ClockReadout } from "./ClockReadout";

describe("ClockReadout", () => {
  test("renders authoritative formatted time without owning a timer", () => {
    const markup = renderToStaticMarkup(
      <ClockReadout label="You" value="01:24" active urgency="warning" tone="friendly" />,
    );

    expect(markup).toContain('role="timer"');
    expect(markup).toContain('aria-label="You: 01:24"');
    expect(markup).toContain('data-active="true"');
    expect(markup).toContain('data-urgency="warning"');
    expect(markup).toContain("01:24");
  });

  test("can keep the label accessible without rendering it visually", () => {
    const markup = renderToStaticMarkup(
      <ClockReadout label="Player time remaining" value="00:09" labelMode="aria" />,
    );

    expect(markup).toContain('aria-label="Player time remaining: 00:09"');
    expect(markup).not.toContain(">Player time remaining<");
  });
});
