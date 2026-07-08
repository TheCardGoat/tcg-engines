// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import type { ReactNode } from "react";

import { CardPreviewProvider } from "../CardPreview/CardPreviewContext";
import { theme } from "../../theme";
import { CardInspectProvider } from "./CardInspectContext";
import { CardImage } from "./CardImage";

const TEST_IMAGE_URL =
  "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/113.webp";

function setHoverCapability(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} env="test">
      <CardInspectProvider>
        <CardPreviewProvider>{children}</CardPreviewProvider>
      </CardInspectProvider>
    </MantineProvider>
  );
}

function renderCardImage() {
  let optionClicks = 0;
  const view = render(
    <button
      type="button"
      data-testid="choice-option"
      onClick={() => {
        optionClicks += 1;
      }}
    >
      <CardImage
        imageUrl={TEST_IMAGE_URL}
        alt="Evelyn Parker - Scheming Siren"
        color="blue"
        previewDetails={{ name: "Evelyn Parker - Scheming Siren", cardType: "unit" }}
        inspectOnTap
      />
    </button>,
    { wrapper: Providers },
  );
  const imageWrap = view.getByAltText("Evelyn Parker - Scheming Siren").parentElement;
  expect(imageWrap).not.toBeNull();
  return { ...view, imageWrap: imageWrap!, optionClicks: () => optionClicks };
}

describe("Cyberpunk CardImage preview and inspect", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
  });

  test("shows the global preview while hovering on hover-capable devices", async () => {
    setHoverCapability(true);
    const { imageWrap } = renderCardImage();

    fireEvent.mouseEnter(imageWrap);
    await waitFor(() => {
      expect(
        document.body.querySelector('[class*="_preview_"][class*="_visible_"]'),
      ).not.toBeNull();
    });

    fireEvent.mouseLeave(imageWrap);
    await waitFor(() => {
      expect(document.body.querySelector('[class*="_preview_"][class*="_visible_"]')).toBeNull();
    });
  });

  test("opens inspect instead of preview on touch-only devices", async () => {
    setHoverCapability(false);
    const { imageWrap, optionClicks } = renderCardImage();

    fireEvent.click(imageWrap);
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
    });

    expect(document.body.querySelector('[class*="_preview_"][class*="_visible_"]')).toBeNull();
    expect(optionClicks()).toBe(0);
  });
});
