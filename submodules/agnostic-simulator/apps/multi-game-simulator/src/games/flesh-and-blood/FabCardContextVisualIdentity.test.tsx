// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import type { SimulatorEntity } from "@tcg/simulator-contract";

import { FAB_CARD_CONTEXT_VISUAL_IDENTITY } from "./FabCardContextVisualIdentity";
import { FabSymbolText } from "./FabSymbolText";

describe("FAB card context symbol text", () => {
  test("renders canonical card-text tokens with official FAB icons", () => {
    const html = renderToStaticMarkup(
      <FabSymbolText text="Action - {r}{r}, {t}: Attack with +1{p} and 2{d}." />,
    );

    expect(html.match(/data-fab-inline-symbol="resource"/gu)).toHaveLength(2);
    expect(html).toContain('data-fab-inline-symbol="tap"');
    expect(html).toContain('data-fab-inline-symbol="power"');
    expect(html).toContain('data-fab-inline-symbol="defense"');
    expect(html).toContain('alt="resource"');
    expect(html).not.toContain("{r}");
  });

  test("leaves unknown placeholders intact", () => {
    const html = renderToStaticMarkup(<FabSymbolText text="Choose {x} and {unknown}." />);

    expect(html).toContain("Choose {x} and {unknown}.");
    expect(html).not.toContain("data-fab-inline-symbol");
  });

  test("shows an Ally's current life instead of a defense value", () => {
    const entity: SimulatorEntity = {
      id: "restless-looter",
      title: "Restless Looter",
      subtitle: "Shadow Necromancer Action - Zombie Ally",
      kind: "card",
      ownerId: "player-1",
      face: "public",
      states: [],
      stats: [
        { label: "Power", value: "3" },
        { label: "Defense", value: "0" },
        { label: "Life", value: "2" },
      ],
      traits: [],
    };
    const identity = FAB_CARD_CONTEXT_VISUAL_IDENTITY.renderIdentity?.({
      entity,
      mode: "quick",
    });
    const html = renderToStaticMarkup(<>{identity}</>);

    expect(html).toContain('aria-label="Life 2"');
    expect(html).toContain('data-fab-icon="life"');
    expect(html).not.toContain('aria-label="Defense 0"');
  });

  test("uses the power icon for an attack activation", () => {
    const icon = FAB_CARD_CONTEXT_VISUAL_IDENTITY.renderActionIcon?.({
      action: {
        id: "fab:activate:restless-looter:attack",
        sourceEntityId: "restless-looter",
        label: "Attack with Restless Looter",
        order: 0,
        activation: "execute",
        availability: { kind: "enabled" },
      },
      disabled: false,
    });
    const html = renderToStaticMarkup(<>{icon}</>);

    expect(html).toContain('data-fab-icon="power"');
  });
});
