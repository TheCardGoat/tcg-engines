// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import type { ReactNode } from "react";

import { CardPreviewProvider, useCardPreview } from "../CardPreview/CardPreviewContext";
import { theme } from "../../theme";
import { CardInspectProvider, useCardInspect } from "./CardInspectContext";
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

function LeakedHiddenPreviewRequest() {
  const { show } = useCardPreview();
  return (
    <button
      type="button"
      onClick={() =>
        show({
          imageUrl: "https://private.invalid/leaked-preview.webp",
          face: "hidden",
          alt: "Leaked Preview",
        })
      }
    >
      Request hidden preview
    </button>
  );
}

function LeakedHiddenInspectRequest() {
  const { inspect } = useCardInspect();
  return (
    <button
      type="button"
      onClick={() =>
        inspect({
          imageUrl: "https://private.invalid/leaked-inspect.webp",
          face: "hidden",
          name: "Leaked Inspect",
        })
      }
    >
      Request hidden inspect
    </button>
  );
}

function renderCardImage(underlay?: ReactNode) {
  let optionClicks = 0;
  const view = render(
    <>
      {underlay}
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
      </button>
    </>,
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
    vi.useRealTimers();
  });

  test("never mounts leaked private art or opens previews for a face-down card", () => {
    setHoverCapability(true);
    const { container, getByAltText } = render(
      <CardImage
        imageUrl="https://private.invalid/opponent-hand-secret.webp"
        faceDown
        alt="Opponent Secret"
        inspectOnTap
      />,
      { wrapper: Providers },
    );

    const cardBack = getByAltText("Hidden card");
    fireEvent.mouseEnter(cardBack.parentElement!);
    fireEvent.click(cardBack.parentElement!);

    expect(container.innerHTML).not.toContain("private.invalid");
    expect(container.innerHTML).not.toContain("Opponent Secret");
    expect(document.body.querySelector('[class*="_preview_"][class*="_visible_"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
  });

  test("rejects a hidden preview request that carries a private URL", () => {
    setHoverCapability(true);
    const { getByRole } = render(<LeakedHiddenPreviewRequest />, { wrapper: Providers });

    fireEvent.click(getByRole("button", { name: "Request hidden preview" }));

    expect(document.body.innerHTML).not.toContain("private.invalid");
    expect(document.body.innerHTML).not.toContain("Leaked Preview");
  });

  test("rejects a hidden inspect request that carries a private URL", () => {
    setHoverCapability(false);
    const { getByRole } = render(<LeakedHiddenInspectRequest />, { wrapper: Providers });

    fireEvent.click(getByRole("button", { name: "Request hidden inspect" }));

    expect(document.body.innerHTML).not.toContain("private.invalid");
    expect(document.body.innerHTML).not.toContain("Leaked Inspect");
    expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
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

  test("closes inspect from its own outside tap layer", async () => {
    setHoverCapability(false);
    const { imageWrap } = renderCardImage();

    fireEvent.click(imageWrap);
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
    });

    fireEvent.pointerDown(
      requiredElement(document.body, '[data-testid="card-inspect-dismiss-layer"]'),
    );
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
    });
  });

  test("closes inspect without dismissing an underlying target sheet", async () => {
    setHoverCapability(false);
    const { imageWrap } = renderCardImage(
      <div data-testid="simulated-target-sheet" role="dialog" aria-label="Choose target" />,
    );

    fireEvent.click(imageWrap);
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
    });

    fireEvent.pointerDown(
      requiredElement(document.body, '[data-testid="card-inspect-dismiss-layer"]'),
    );
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
    });
    expect(document.body.querySelector('[data-testid="simulated-target-sheet"]')).not.toBeNull();
  });

  test("closes inspect without dismissing an underlying drawer", async () => {
    setHoverCapability(false);
    const { imageWrap } = renderCardImage(
      <div data-testid="simulated-drawer" role="dialog" aria-label="Player actions" />,
    );

    fireEvent.click(imageWrap);
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
    });

    fireEvent.pointerDown(
      requiredElement(document.body, '[data-testid="card-inspect-dismiss-layer"]'),
    );
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
    });
    expect(document.body.querySelector('[data-testid="simulated-drawer"]')).not.toBeNull();
  });

  test("keeps inspect open when interacting inside the card", async () => {
    setHoverCapability(false);
    const { imageWrap } = renderCardImage();

    fireEvent.click(imageWrap);
    const modal = await waitFor(() =>
      requiredElement<HTMLElement>(document.body, '[data-testid="card-inspect-modal"]'),
    );

    fireEvent.pointerDown(requiredElement(modal, '[data-testid="card-inspect-image"]'));
    expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
  });

  test("closes inspect from the close countdown button", async () => {
    setHoverCapability(false);
    const { imageWrap } = renderCardImage();

    fireEvent.click(imageWrap);
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
    });

    expect(
      requiredElement(document.body, '[data-testid="card-inspect-countdown"]').textContent,
    ).toBe("15");
    fireEvent.click(requiredElement(document.body, '[aria-label="Close inspect"]'));
    await waitFor(() => {
      expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
    });
  });

  test("updates the countdown and auto-closes inspect after fifteen seconds", () => {
    vi.useFakeTimers();
    setHoverCapability(false);
    const { imageWrap } = renderCardImage();

    fireEvent.click(imageWrap);
    expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).not.toBeNull();
    expect(
      requiredElement(document.body, '[data-testid="card-inspect-countdown"]').textContent,
    ).toBe("15");

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(
      requiredElement(document.body, '[data-testid="card-inspect-countdown"]').textContent,
    ).toBe("14");

    act(() => {
      vi.advanceTimersByTime(14_000);
    });

    expect(document.body.querySelector('[data-testid="card-inspect-modal"]')).toBeNull();
  });
});

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Expected element matching ${selector}.`);
  }
  return element;
}
