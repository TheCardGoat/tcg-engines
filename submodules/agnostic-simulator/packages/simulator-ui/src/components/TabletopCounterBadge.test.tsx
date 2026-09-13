import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { TabletopCounterBadge } from "./TabletopCounterBadge";

describe("TabletopCounterBadge", () => {
  test("applies mono tabular numerals when mono is set", () => {
    const markup = renderToStaticMarkup(<TabletopCounterBadge label="RES" value="01/01" mono />);

    expect(markup).toContain("font-mono");
    expect(markup).toContain("tabular-nums");
    expect(markup).toContain("01/01");
  });

  test("stays non-mono by default", () => {
    const markup = renderToStaticMarkup(<TabletopCounterBadge label="Deck" value={38} />);

    expect(markup).not.toContain("font-mono");
    expect(markup).not.toContain("tabular-nums");
    expect(markup).toContain("38");
  });

  test("sizes itself to its contents", () => {
    const markup = renderToStaticMarkup(<TabletopCounterBadge label="Deck" value={38} />);

    expect(markup).toContain("w-fit");
  });
});
