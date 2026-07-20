import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { ConnectionPanel } from "./ConnectionPanel";

describe("ConnectionPanel", () => {
  test("renders a labeled, inspectable connection status", () => {
    const markup = renderToStaticMarkup(
      <ConnectionPanel
        embedded
        sides={[
          {
            side: "player",
            label: "You",
            self: true,
            connection: { status: "connected", latencyMs: 42 },
          },
        ]}
      />,
    );

    expect(markup).toContain('aria-label="Connection diagnostics"');
    expect(markup).toContain('aria-label="You connection status: Connected"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain("aria-controls=");
    expect(markup).toContain('data-connection-status="connected"');
  });

  test("supports an end-aligned indicator for narrow rails", () => {
    const markup = renderToStaticMarkup(
      <ConnectionPanel
        embedded
        indicatorOnly
        popoverAlign="end"
        sides={[{ side: "player", label: "You", connection: { status: "reconnecting" } }]}
      />,
    );

    expect(markup).toContain('aria-label="You connection status: Reconnecting"');
    expect(markup).not.toContain(">You<");
  });

  test("accepts the complete sanitized diagnostic as its copy payload", () => {
    const markup = renderToStaticMarkup(
      <ConnectionPanel
        copyPayload={{ schemaVersion: 1, gameSlug: "gundam", route: "/match" }}
        sides={[{ side: "player", label: "You", connection: { status: "connected" } }]}
      />,
    );

    expect(markup).toContain("Connection diagnostics");
  });
});
