import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { DropTargetFrame } from "./DropTargetFrame";

describe("DropTargetFrame", () => {
  const theme = { accent: "#65d9a8", surface: "#063a2a" };

  it("uses consumer-owned theme tokens and switches to the active label", () => {
    const preview = renderToStaticMarkup(
      <DropTargetFrame theme={theme} label="Pair" activeLabel="Release" isOver={false} />,
    );
    const active = renderToStaticMarkup(
      <DropTargetFrame theme={theme} label="Pair" activeLabel="Release" isOver />,
    );

    expect(preview).toContain("Pair");
    expect(preview).toContain("--drop-target-accent:#65d9a8");
    expect(active).toContain("Release");
  });
});
