// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";

import {
  drawTransferRect,
  fitRectToAspectRatio,
  transferNodeRect,
  entityTransferSuppressesEndpoint,
  mergePortalTransferCaptures,
  portalTransferEndpointsReady,
  selectEntityEndpoint,
  transferTransform,
  uniformTransferScale,
} from "./EntityTransferLayer.tsx";

describe("uniformTransferScale", () => {
  it("keeps a card's aspect ratio when source and destination slots differ", () => {
    expect(uniformTransferScale({ width: 100, height: 140 }, { width: 176, height: 150 })).toBe(
      150 / 140,
    );
  });

  it("does not produce an invalid transform for an unmeasured source", () => {
    expect(uniformTransferScale({ width: 0, height: 0 }, { width: 176, height: 150 })).toBe(1);
  });
});

describe("selectEntityEndpoint", () => {
  const destination = { presence: "present" as const, zoneId: "player:hand" };
  const source = { presence: "exiting" as const, zoneId: "player:deck" };

  it("selects only entity nodes registered in the declared zone", () => {
    expect(
      selectEntityEndpoint([destination, source], { kind: "zone", id: "player:deck" }, "exiting"),
    ).toBe(source);
  });

  it("does not substitute a destination entity for a missing source-zone entity", () => {
    expect(
      selectEntityEndpoint([destination], { kind: "zone", id: "player:deck" }, "exiting"),
    ).toBeNull();
  });

  it("can still select by identity when the animation reference is not a zone", () => {
    expect(
      selectEntityEndpoint([destination, source], { kind: "entity", id: "card-1" }, "exiting"),
    ).toBe(source);
  });
});

describe("entityTransferSuppressesEndpoint", () => {
  it("preserves a copied source", () => {
    expect(
      entityTransferSuppressesEndpoint(
        { sourcePresentation: "copy", destinationPresentation: "replace" },
        "source",
      ),
    ).toBe(false);
  });

  it("preserves an overlaid destination", () => {
    expect(
      entityTransferSuppressesEndpoint(
        { sourcePresentation: "move", destinationPresentation: "overlay" },
        "destination",
      ),
    ).toBe(false);
  });

  it("keeps existing move semantics by default", () => {
    expect(entityTransferSuppressesEndpoint({}, "source")).toBe(true);
    expect(entityTransferSuppressesEndpoint({}, "destination")).toBe(true);
  });
});

describe("mergePortalTransferCaptures", () => {
  it("keeps the first geometry capture stable while registry updates add endpoints", () => {
    const firstCapture = { step: { id: "draw-1" }, sourceRect: { left: 12 } };
    const recapturedFirst = { step: { id: "draw-1" }, sourceRect: { left: 48 } };
    const secondCapture = { step: { id: "draw-2" }, sourceRect: { left: 72 } };

    const captures = mergePortalTransferCaptures([firstCapture], [recapturedFirst, secondCapture]);

    expect(captures).toEqual([firstCapture, secondCapture]);
    expect(captures[0]).toBe(firstCapture);
  });

  it("reuses the current array when registry churn discovers nothing new", () => {
    const current = [{ step: { id: "pitch-1" } }];

    expect(mergePortalTransferCaptures(current, [])).toBe(current);
    expect(mergePortalTransferCaptures(current, [{ step: { id: "pitch-1" } }])).toBe(current);
  });
});

describe("portalTransferEndpointsReady", () => {
  const node = {};

  it("waits for both endpoints when the transfer declares both", () => {
    const step = {
      from: { kind: "zone" as const, id: "player:hand" },
      to: { kind: "zone" as const, id: "player:stack" },
    };

    expect(portalTransferEndpointsReady(step, node, null)).toBe(false);
    expect(portalTransferEndpointsReady(step, null, node)).toBe(false);
    expect(portalTransferEndpointsReady(step, node, node)).toBe(true);
  });

  it("allows an omitted endpoint for enter and exit transfers", () => {
    expect(
      portalTransferEndpointsReady({ to: { kind: "zone", id: "player:hand" } }, null, node),
    ).toBe(true);
    expect(
      portalTransferEndpointsReady({ from: { kind: "zone", id: "player:hand" } }, node, null),
    ).toBe(true);
  });
});

describe("transferTransform", () => {
  it("emits a complete compositor-safe transform string", () => {
    expect(transferTransform(12, -8, 4, 0.75)).toBe(
      "translate3d(12px, -8px, 0) rotate(4deg) scale(0.75)",
    );
  });
});

describe("transfer geometry", () => {
  it("flies a draw at hand size centered on the deck marker", () => {
    const source = { left: 100, top: 200, width: 18, height: 25 };
    const destination = { left: 500, top: 600, width: 92, height: 128 };
    const flight = drawTransferRect(source, destination);
    expect(flight).toEqual({ left: 63, top: 148.5, width: 92, height: 128 });
    expect(uniformTransferScale(flight, destination)).toBe(1);
  });

  it("fits portrait art inside a landscape shield marker without stretching", () => {
    const fitted = fitRectToAspectRatio({ left: 100, top: 200, width: 34, height: 12 }, 5 / 7);
    expect(fitted.width).toBeCloseTo(60 / 7);
    expect(fitted.height).toBe(12);
    expect(fitted.left + fitted.width / 2).toBeCloseTo(117);
    expect(fitted.top).toBe(200);
  });

  it("uses projected card proportions for a zone-only counter registration", () => {
    const node = document.createElement("div");
    const marker = document.createElement("span");
    marker.setAttribute("data-sim-animation-geometry", "");
    marker.getBoundingClientRect = () => new DOMRect(100, 200, 34, 12);
    node.append(marker);
    const rect = transferNodeRect(
      { key: "trash", ref: { kind: "zone", id: "trash:player" }, node, presence: "present" },
      "card-1",
      5 / 7,
    );
    expect(rect.width).toBeCloseTo(60 / 7);
    expect(rect.height).toBe(12);
    expect(rect.left + rect.width / 2).toBeCloseTo(117);
  });

  it("preserves card proportions when a pile contains the exact moving entity", () => {
    const node = document.createElement("div");
    const card = document.createElement("div");
    card.dataset.simEntityId = "card-1";
    card.getBoundingClientRect = () => new DOMRect(100, 200, 70, 60);
    node.append(card);
    const rect = transferNodeRect(
      { key: "deck", ref: { kind: "zone", id: "deck:player" }, node, presence: "present" },
      "card-1",
      5 / 7,
    );
    expect(rect.width).toBeCloseTo(300 / 7);
    expect(rect.height).toBeCloseTo(60);
    expect(rect.left + rect.width / 2).toBeCloseTo(135);
  });

  it("keeps explicit anchor bounds", () => {
    const node = document.createElement("div");
    node.getBoundingClientRect = () => new DOMRect(100, 200, 34, 12);
    const rect = transferNodeRect(
      { key: "focus", ref: { kind: "anchor", id: "focus" }, node, presence: "present" },
      "card-1",
      5 / 7,
    );
    expect(rect.width).toBe(34);
    expect(rect.height).toBe(12);
  });
});
