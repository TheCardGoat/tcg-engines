import { MantineProvider } from "@mantine/core";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { FabCardPreviewFallback } from "./FabCardPreview";
import { createFabCardArtResolver } from "./cardArt";

afterEach(cleanup);

it("never borrows real artwork for an explicitly invented fixture identity", () => {
  const resolver = createFabCardArtResolver({
    records: {
      snatch: {
        canonicalId: "snatch",
        slug: "snatch-red",
        name: "Snatch",
        keywords: [],
        printings: {},
        imageAspectRatio: 1,
        boardImageUrl: "https://example.test/snatch.webp",
      },
    },
    aliases: { Snatch: "snatch" },
  });
  expect(
    resolver.resolveFabCardArt({ canonicalId: "fixture-trigger-decision-snatch", name: "Snatch" })
      .boardImageUrl,
  ).toBeUndefined();
});

const entity: SimulatorEntity = {
  id: "fixture-card",
  title: "Reveal Lab Attack",
  subtitle: "Action Attack",
  kind: "card",
  ownerId: "player-1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
  dataAttributes: { "data-fab-canonical-id": "fixture-animation-reveal-attack" },
};

it.each(["board", "preview"] as const)(
  "labels invented cards on the %s without a broken-image warning or retry",
  (variant) => {
    const view = render(
      <MantineProvider>
        <FabCardPreviewFallback
          entity={entity}
          status="error"
          variant={variant}
          onRetry={() => {}}
        />
      </MantineProvider>,
    );
    expect(view.getByText("Test card placeholder · No printed artwork")).toBeTruthy();
    expect(view.queryByText("Image unavailable")).toBeNull();
    expect(view.queryByRole("button", { name: "Retry card image" })).toBeNull();
    expect(view.container.querySelector("img")).toBeNull();
  },
);

it("keeps real missing artwork visibly distinct from intentional placeholders", () => {
  const view = render(
    <MantineProvider>
      <FabCardPreviewFallback
        entity={{
          ...entity,
          title: "Otherworldly Sins",
          dataAttributes: { "data-fab-canonical-id": "qk9CgqWCcCFdkddzNngPh" },
        }}
        status="error"
        onRetry={() => {}}
      />
    </MantineProvider>,
  );
  expect(view.getByText("Image unavailable")).toBeTruthy();
  expect(view.getByRole("button", { name: "Retry card image" })).toBeTruthy();
  expect(view.queryByText("Test card placeholder · No printed artwork")).toBeNull();
});
