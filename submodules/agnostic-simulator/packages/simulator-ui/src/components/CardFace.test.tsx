// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vite-plus/test";

import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFace } from "./CardFace";

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

function renderCard(entity: SimulatorEntity): HTMLDivElement {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<CardFace entity={entity} as="div" density="full" />));
  return container;
}

describe("CardFace image fallback", () => {
  test("replaces an unavailable public image with readable card chrome", () => {
    const card = renderCard({
      id: "missing-art-card",
      title: "Readable Preview Card",
      subtitle: "Character",
      kind: "character",
      ownerId: "player",
      face: "public",
      states: ["ready"],
      stats: [{ label: "Power", value: "7" }],
      traits: ["Leaf"],
      imageUrl: "https://cdn.example.invalid/missing-art.webp",
    });
    const image = card.querySelector("img");

    expect(image).toBeInstanceOf(HTMLImageElement);
    act(() => image?.dispatchEvent(new Event("error")));

    expect(card.querySelector("img")).toBeNull();
    expect(card.textContent).toContain("Readable Preview Card");
    expect(card.textContent).toContain("Power");
    expect(card.textContent).toContain("7");
  });
});
