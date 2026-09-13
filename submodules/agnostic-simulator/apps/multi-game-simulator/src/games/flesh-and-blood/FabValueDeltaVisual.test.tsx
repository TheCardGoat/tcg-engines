import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FabValueDeltaVisual } from "./FabValueDeltaVisual";

describe("FabValueDeltaVisual", () => {
  it("uses the official life symbol and names combat damage", () => {
    const markup = renderToStaticMarkup(
      <FabValueDeltaVisual
        step={{
          id: "damage",
          type: "valueDelta",
          subject: { kind: "player", id: "player-2" },
          delta: -6,
          label: "damage",
          fromValue: 6,
          toValue: 0,
          tone: "negative",
          audioCue: "combat.hit",
        }}
      />,
    );

    expect(markup).toContain('data-fab-icon="life"');
    expect(markup).toContain('data-kind="damage"');
    expect(markup).toContain("Damage");
    expect(markup).toContain("6 → 0");
  });

  it("uses resource, chi, and prevention-specific symbols", () => {
    const resource = renderToStaticMarkup(
      <FabValueDeltaVisual
        step={{
          id: "resource",
          type: "valueDelta",
          subject: { kind: "anchor", id: "fab:p1:resource" },
          delta: -2,
          label: "resource",
        }}
      />,
    );
    const chi = renderToStaticMarkup(
      <FabValueDeltaVisual
        step={{
          id: "chi",
          type: "valueDelta",
          subject: { kind: "anchor", id: "fab:p1:chi" },
          delta: 1,
          label: "chi",
        }}
      />,
    );
    const prevention = renderToStaticMarkup(
      <FabValueDeltaVisual
        step={{
          id: "prevention",
          type: "valueDelta",
          subject: { kind: "player", id: "p1" },
          delta: 3,
          label: "prevented",
        }}
      />,
    );

    expect(resource).toContain('data-fab-icon="resource"');
    expect(resource).toContain("Resources spent");
    expect(chi).toContain('data-fab-icon="chi"');
    expect(prevention).toContain("Damage prevented");
    expect(prevention).toContain("lucide-shield");
  });
});
