// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FabHeroIdentityMedia } from "./FabHeroIdentityMedia";

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(
      JSON.stringify({
        heroes: [
          {
            name: "Dorinthea",
            portrait: "dorinthea-portrait.webp",
            background: "dorinthea-background.webp",
            video: "dorinthea.mp4",
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("FabHeroIdentityMedia", () => {
  it("uses the rendered identity owner's subscription for image versus video media", async () => {
    const { container } = render(
      <>
        <FabHeroIdentityMedia
          heroName="Dorinthea Ironsong"
          ownerSubscriptionTier="free"
          fallbackPortraitUrl="fallback.webp"
          className="free-identity"
          videoClassName="hero-video"
          videoTestId="free-video"
        />
        <FabHeroIdentityMedia
          heroName="Dorinthea Ironsong"
          ownerSubscriptionTier="tier4"
          fallbackPortraitUrl="fallback.webp"
          className="premium-identity"
          videoClassName="hero-video"
          videoTestId="premium-video"
        />
      </>,
    );

    expect(await screen.findByTestId("premium-video")).not.toBeNull();
    expect(screen.queryByTestId("free-video")).toBeNull();
    await waitFor(() =>
      expect(
        container.querySelector<HTMLElement>(".free-identity")?.style.backgroundImage,
      ).toContain("dorinthea-background.webp"),
    );
    expect(container.querySelector(".free-identity")?.getAttribute("data-media-kind")).toBe(
      "image",
    );
    expect(container.querySelector(".premium-identity")?.getAttribute("data-media-kind")).toBe(
      "video",
    );
    expect(
      screen.getByTestId("premium-video").querySelector("source")?.getAttribute("src"),
    ).toContain("dorinthea.mp4");
  });
});
