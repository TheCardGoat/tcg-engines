import { testFabArt } from "./presentation-test-provider";
const { imageUrlForFabCard, resolveFabCardArt } = testFabArt;
import { FabPresentationTestProvider } from "./presentation-test-provider";
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { cleanup, fireEvent, render as renderWithTestingLibrary } from "@testing-library/react";
import type { SimulatorEntity } from "@tcg/simulator-contract";

import { FabBoardCardFace } from "./FabBoardCardFace";
import {
  FAB_PREVIEW_TARGET_ATTR,
  FabCardPreviewProvider,
  FabCardPreviewSurface,
  useFabPreviewTarget,
} from "./FabCardPreview";
import { FabMobileChoicePreview } from "./FabMobileChoicePreview";

const render = (ui: ReactNode) =>
  renderWithTestingLibrary(ui, { wrapper: FabPresentationTestProvider });

const visibleCard: SimulatorEntity = {
  id: "preview-card",
  title: "Preview card",
  subtitle: "Action",
  kind: "card",
  ownerId: "player-1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
  imageUrl: "https://example.test/cards/preview.webp",
  details: {
    rules: [
      {
        id: "printed-card-text",
        kind: "text",
        text: "Deal 3 damage to target hero.",
      },
    ],
  },
};

function parseCssAspectRatio(value: string): number {
  const [numerator = "1", denominator = "1"] = value.split("/");
  return Number(numerator.trim()) / Number(denominator.trim());
}

function PreviewTrigger({ entity }: { entity: SimulatorEntity }) {
  const { previewProps } = useFabPreviewTarget(entity);
  return (
    <button type="button" {...previewProps}>
      Show preview
    </button>
  );
}

describe("FabCardPreview", () => {
  beforeEach(() => {
    const mediaQueryList: MediaQueryList = {
      matches: true,
      media: "(any-hover: hover)",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    };
    window.matchMedia = () => mediaQueryList;
  });

  afterEach(cleanup);

  it("shows the full public card on desktop hover", () => {
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={visibleCard} density="compact" />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));

    const preview = view.getByTestId("fab-card-preview");
    expect(preview.getAttribute("data-visible")).toBe("true");
    expect(preview.getAttribute("data-mode")).toBe("hover");
    expect(preview.textContent).toContain("Deal 3 damage to target hero.");
    expect(view.getByRole("button", { name: "Close card preview" })).not.toBeNull();
  });

  it("closes immediately when the mouse leaves the card or a focused card loses focus", () => {
    const view = render(
      <FabCardPreviewProvider>
        <PreviewTrigger entity={visibleCard} />
      </FabCardPreviewProvider>,
    );
    const trigger = view.getByRole("button", { name: "Show preview" });
    const preview = view.getByTestId("fab-card-preview");
    fireEvent.mouseEnter(trigger);
    expect(preview.getAttribute("data-visible")).toBe("true");
    fireEvent.mouseLeave(trigger);
    expect(preview.getAttribute("data-visible")).toBeNull();
    fireEvent.focus(trigger);
    expect(preview.getAttribute("data-visible")).toBe("true");
    fireEvent.blur(trigger);
    expect(preview.getAttribute("data-visible")).toBeNull();
  });

  it("keeps one fixed preview position without measuring the trigger", () => {
    const view = render(
      <FabCardPreviewProvider>
        <PreviewTrigger entity={visibleCard} />
      </FabCardPreviewProvider>,
    );
    const trigger = view.getByRole("button", { name: "Show preview" });
    trigger.getBoundingClientRect = () => {
      throw new Error("Fixed previews must not measure their trigger");
    };

    fireEvent.mouseEnter(trigger);

    const preview = view.getByTestId("fab-card-preview");
    expect(preview.getAttribute("data-visible")).toBe("true");
    expect(preview.style.getPropertyValue("--fab-preview-left")).toBe("");
  });

  it("closes from the preview close button", () => {
    const view = render(
      <FabCardPreviewProvider>
        <PreviewTrigger entity={visibleCard} />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByRole("button", { name: "Show preview" }));
    fireEvent.click(view.getByRole("button", { name: "Close card preview" }));

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).toBeNull();
  });

  it("keeps a newer card preview when the previous card sends a stale leave", () => {
    const view = render(
      <FabCardPreviewProvider>
        <PreviewTrigger entity={visibleCard} />
        <PreviewTrigger entity={{ ...visibleCard, id: "next", title: "Next card" }} />
      </FabCardPreviewProvider>,
    );
    const [first, second] = view.getAllByRole("button", { name: "Show preview" });
    const preview = view.getByTestId("fab-card-preview");
    fireEvent.mouseEnter(first!);
    fireEvent.mouseEnter(second!);
    fireEvent.mouseLeave(first!);
    expect(preview.getAttribute("data-visible")).toBe("true");
    expect(preview.textContent).toContain("Next card");
    fireEvent.mouseLeave(second!);
    expect(preview.getAttribute("data-visible")).toBeNull();
  });

  it("keeps an explicit pin when both the opener and preview are left", () => {
    function PinTrigger() {
      const { previewProps } = useFabPreviewTarget(visibleCard, { pinOnClick: true });
      return <button {...previewProps}>Pin card</button>;
    }
    const view = render(
      <FabCardPreviewProvider>
        <PinTrigger />
      </FabCardPreviewProvider>,
    );
    const trigger = view.getByRole("button", { name: "Pin card" });
    const preview = view.getByTestId("fab-card-preview");
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    fireEvent.click(trigger);
    fireEvent.mouseEnter(preview);
    fireEvent.mouseLeave(preview);
    expect(preview.getAttribute("data-mode")).toBe("pinned");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(preview.getAttribute("data-visible")).toBeNull();
  });

  it("keeps the selected printing when mobile choices share a canonical card", () => {
    const selectedPrinting: SimulatorEntity = {
      ...visibleCard,
      id: "selected-printing",
      title: "Selected printing",
      dataAttributes: { "data-fab-canonical-id": "shared-card" },
    };

    const view = render(
      <FabMobileChoicePreview
        entity={selectedPrinting}
        candidates={[
          {
            ...visibleCard,
            id: "first-printing",
            title: "First printing",
            dataAttributes: { "data-fab-canonical-id": "shared-card" },
          },
          selectedPrinting,
        ]}
      />,
    );

    expect(view.getByText("Preview Selected printing", { selector: "summary" })).not.toBeNull();
    expect(
      view.getByTestId("fab-card-preview-surface").querySelector(".fab-card-preview-fallback-title")
        ?.textContent,
    ).toBe("Selected printing");
  });

  it("resets mobile navigation when focus returns to a previous card", () => {
    const cardA = { ...visibleCard, id: "card-a", title: "Card A" };
    const cardB = { ...visibleCard, id: "card-b", title: "Card B" };
    const cardC = { ...visibleCard, id: "card-c", title: "Card C" };
    const candidates = [cardA, cardB, cardC];
    const preview = (entity: SimulatorEntity) => (
      <FabMobileChoicePreview key={entity.id} entity={entity} candidates={candidates} />
    );
    const view = render(preview(cardA));

    fireEvent.click(view.getByRole("button", { name: "Preview next card" }));
    expect(view.getByText("Preview Card B", { selector: "summary" })).not.toBeNull();

    view.rerender(preview(cardC));
    view.rerender(preview(cardA));
    expect(view.getByText("Preview Card A", { selector: "summary" })).not.toBeNull();
  });

  it("can explicitly disable previews", () => {
    const view = render(
      <FabCardPreviewProvider disabled>
        <FabBoardCardFace entity={visibleCard} density="compact" />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).toBeNull();
  });

  it("does not let a stale hover end clear a newer card preview", () => {
    const nextCard = { ...visibleCard, id: "next-card", title: "Next card" };
    const view = render(
      <FabCardPreviewProvider>
        <PreviewTrigger entity={visibleCard} />
        <PreviewTrigger entity={nextCard} />
      </FabCardPreviewProvider>,
    );
    const triggers = view.getAllByRole("button", { name: "Show preview" });

    fireEvent.mouseEnter(triggers[0]!);
    fireEvent.mouseEnter(triggers[1]!);
    fireEvent.mouseLeave(triggers[0]!);

    expect(view.getByTestId("fab-card-preview").textContent).toContain("Next card");
    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("honors an actual mouse hover even when the media query reports no hover", () => {
    window.matchMedia = () =>
      ({
        matches: false,
        media: "(any-hover: hover)",
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) satisfies MediaQueryList;
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={visibleCard} density="compact" />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("replaces the preview text fallback when the published card image has loaded", async () => {
    const canonicalId = "TN6DmN7GK9DtMKd9pnmwF";

    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace
          entity={{
            ...visibleCard,
            title: "Tectonic Plating",
            dataAttributes: { "data-fab-canonical-id": canonicalId },
          }}
          density="compact"
        />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));
    fireEvent.load(view.getByTestId("fab-card-preview").querySelector("img")!);

    expect(
      view.getByTestId("fab-card-preview").querySelector(".fab-card-preview-fallback"),
    ).toBeNull();
  });

  it("renders official symbols in the loading card-information fallback", () => {
    const symbolCard: SimulatorEntity = {
      ...visibleCard,
      details: {
        rules: [
          {
            id: "printed-card-text",
            kind: "text",
            text: "Action - {r}{r}: Attack with +1{p}.",
          },
        ],
      },
    };
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={symbolCard} density="compact" />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));

    const fallback = view.getByTestId("fab-card-preview");
    expect(fallback.querySelectorAll('[data-fab-inline-symbol="resource"]')).toHaveLength(2);
    expect(fallback.querySelectorAll('[data-fab-inline-symbol="power"]')).toHaveLength(1);
    expect(fallback.textContent).not.toContain("{r}");
    expect(fallback.textContent).not.toContain("{p}");
  });

  it("uses official stat icons in the loading card-information fallback", () => {
    const view = render(
      <FabCardPreviewSurface
        entity={{
          ...visibleCard,
          stats: [
            { label: "Pitch", value: "1" },
            { label: "Cost", value: "0" },
            { label: "Power", value: "6" },
            { label: "Defense", value: "3" },
          ],
        }}
      />,
    );

    expect(view.getByTestId("fab-icon-pitch-1")).not.toBeNull();
    expect(view.getByTestId("fab-icon-cost")).not.toBeNull();
    expect(view.getByTestId("fab-icon-power")).not.toBeNull();
    expect(view.getByTestId("fab-icon-defense")).not.toBeNull();
    expect(view.getByAltText("Power")).not.toBeNull();
    expect(view.queryByAltText("Attack")).toBeNull();
    expect(view.getByLabelText("Red pitch: 1")).not.toBeNull();
    expect(
      view
        .getByTestId("fab-icon-pitch-1")
        .closest("dt")
        ?.nextElementSibling?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it.each([
    { width: 546, height: 763, rotated: "true" },
    { width: 763, height: 546, rotated: null },
  ])("orients a split card asset sized $width by $height", ({ width, height, rotated }) => {
    const canonicalId = "nnQpNFFKqfMwJbRQ6brJ6";

    const splitCard = {
      ...visibleCard,
      title: "Everbloom // Life",
      imageAspectRatio: 2079 / 1488,
      dataAttributes: { "data-fab-canonical-id": canonicalId },
    };
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={splitCard} density="compact" />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));

    expect(parseCssAspectRatio(view.getByTestId("fab-card-preview").style.aspectRatio)).toBeCloseTo(
      2079 / 1488,
    );
    const surface = view.getByTestId("fab-card-preview-surface");
    const image = surface.querySelector("img")!;
    Object.defineProperties(image, {
      naturalWidth: { value: width },
      naturalHeight: { value: height },
    });
    fireEvent.load(image);
    expect(surface.getAttribute("data-rotated")).toBe(rotated);
  });

  it("closes a hover preview with Escape", () => {
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={visibleCard} density="compact" />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));
    fireEvent.keyDown(view.getByTestId("card"), { key: "Escape" });

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
  });

  it("keeps a hover preview open when leave fires while occupancy stays on the card", () => {
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={visibleCard} density="compact" />
      </FabCardPreviewProvider>,
    );
    const card = view.getByTestId("card");
    fireEvent.mouseEnter(card);
    const target = card.closest(`[${FAB_PREVIEW_TARGET_ATTR}]`);
    expect(target).not.toBeNull();
    fireEvent.mouseLeave(target!, { relatedTarget: target });

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("closes a pinned preview with the close button", () => {
    function PinTrigger({ entity }: { entity: SimulatorEntity }) {
      const { previewProps } = useFabPreviewTarget(entity, { pinOnClick: true });
      return (
        <button type="button" {...previewProps}>
          Pin preview
        </button>
      );
    }
    const view = render(
      <FabCardPreviewProvider>
        <PinTrigger entity={visibleCard} />
      </FabCardPreviewProvider>,
    );

    fireEvent.click(view.getByRole("button", { name: "Pin preview" }));
    expect(view.getByTestId("fab-card-preview").getAttribute("data-mode")).toBe("pinned");
    fireEvent.click(view.getByRole("button", { name: "Close card preview" }));

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
  });

  it("does not reveal hidden cards", () => {
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace
          entity={{ ...visibleCard, face: "hidden", title: "Hidden card", imageUrl: undefined }}
          density="compact"
        />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByTestId("card"));

    expect(view.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
  });

  it("shows a passive compact counter stack and preserves its accessible name", () => {
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace
          entity={{
            ...visibleCard,
            decorations: [
              {
                id: "fab-counter-0",
                slot: "top-end",
                ariaLabel: "energy",
                content: { kind: "text", text: "×6" },
                tone: "warning",
              },
            ],
          }}
          density="compact"
        />
      </FabCardPreviewProvider>,
    );

    const marker = view.getByTestId("fab-card-counter");
    expect(marker.textContent).toBe("×6");
    expect(marker.getAttribute("data-fab-counter-icon")).toBe("fallback");
    expect(marker.getAttribute("data-fab-counter-stacked")).toBe("true");
    expect(view.getByTestId("card").getAttribute("aria-label")).toContain("Counters: energy: ×6");
    expect(view.queryByRole("tooltip")).toBeNull();
  });

  it("caps visible counter types and keeps the full accessible summary", () => {
    const decorations = ["energy", "steam", "+1 p", "verse"].map((ariaLabel, index) => ({
      id: `fab-counter-${index}`,
      slot: "top-end" as const,
      ariaLabel,
      content: { kind: "text" as const, text: "×1" },
      tone: "warning" as const,
    }));
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace entity={{ ...visibleCard, decorations }} density="compact" />
      </FabCardPreviewProvider>,
    );

    expect(view.getAllByTestId("fab-card-counter")).toHaveLength(3);
    expect(view.getByTestId("fab-card-counter-overflow").textContent).toBe("+1");
    expect(view.getByTestId("card").getAttribute("aria-label")).toContain("verse: ×1");
  });

  it("uses the defense icon for a defense counter", () => {
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace
          entity={{
            ...visibleCard,
            decorations: [
              {
                id: "fab-counter-0",
                slot: "top-end",
                ariaLabel: "-1 d",
                content: { kind: "text", text: "-1" },
                tone: "warning",
              },
            ],
          }}
          density="compact"
        />
      </FabCardPreviewProvider>,
    );

    expect(view.getByTestId("fab-card-counter").getAttribute("data-fab-counter-icon")).toBe(
      "defense",
    );
  });

  it("shows the published board crop on the board and full asset in preview", async () => {
    const canonicalId = "TN6DmN7GK9DtMKd9pnmwF";

    const printedFallback = "https://example.test/cards/tectonic-plating.webp";
    const view = render(
      <FabCardPreviewProvider>
        <FabBoardCardFace
          entity={{
            ...visibleCard,
            title: "Tectonic Plating",
            imageUrl: printedFallback,
            dataAttributes: { "data-fab-canonical-id": canonicalId },
          }}
          density="compact"
        />
      </FabCardPreviewProvider>,
    );

    const boardCard = view.getByTestId("card");
    const boardImage = boardCard.querySelector("img")!;
    expect(boardImage.src).toMatch(/\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    expect(parseCssAspectRatio(boardCard.style.aspectRatio)).toBe(1);

    fireEvent.mouseEnter(boardCard);
    const previewImage = view.getByTestId("fab-card-preview").querySelector("img")!;
    expect(previewImage.src).toBe(resolveFabCardArt({ canonicalId }).printedImageUrl);
    expect(previewImage.src).toMatch(/\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/);
    expect(previewImage.src).not.toBe(imageUrlForFabCard({ canonicalId }));

    fireEvent.error(boardImage);
    expect(view.getByTestId("card").querySelector("img")).toBeNull();
    expect(view.getByText("Image unavailable")).not.toBeNull();
  });

  it("uses the published full-card asset for every public FAB preview", async () => {
    const canonicalId = "TN6DmN7GK9DtMKd9pnmwF";

    const view = render(
      <FabCardPreviewProvider>
        <PreviewTrigger
          entity={{
            ...visibleCard,
            title: "Tectonic Plating",
            imageUrl:
              "https://cdn.tcg.online/public/fab/cards/WTR/equipments/WTR041-tectonic-plating.webp",
            imageAspectRatio: 1,
            dataAttributes: {
              "data-fab-canonical-id": canonicalId,
              "data-art-variant": "no-text",
            },
          }}
        />
      </FabCardPreviewProvider>,
    );

    fireEvent.mouseEnter(view.getByRole("button", { name: "Show preview" }));

    const preview = view.getByTestId("fab-card-preview");
    const previewImage = preview.querySelector("img")!;
    expect(previewImage.src).toBe(resolveFabCardArt({ canonicalId }).printedImageUrl);
    expect(previewImage.src).toMatch(/\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/);
    expect(parseCssAspectRatio(preview.style.aspectRatio)).toBeCloseTo(63 / 88);
    const original = view.getByRole("link", { name: "Open full-size card image in a new tab" });
    expect(original.getAttribute("href")).toBe(previewImage.src);
    expect(original.getAttribute("target")).toBe("_blank");
    expect(original.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("does not retry a provider image when a printing identity has no asset", async () => {
    const canonicalId = "TN6DmN7GK9DtMKd9pnmwF";

    const view = render(
      <FabCardPreviewSurface
        entity={{
          ...visibleCard,
          title: "Tectonic Plating",
          dataAttributes: {
            "data-fab-canonical-id": canonicalId,
            "data-fab-printing-id": "missing-printing",
          },
        }}
      />,
    );

    const previewImage = view.getByTestId("fab-card-preview-surface").querySelector("img");
    expect(previewImage).toBeNull();
    expect(view.getByText("Image unavailable")).not.toBeNull();
  });
});
