import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import CardFaceTestHost from "./CardFace.test-host.svelte";

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: "card-1",
    definitionId: "def-card-1",
    facePresentation: "faceUp",
    isMasked: false,
    label: "Darkwing Duck - Cool Under Pressure",
    ownerId: "player-two",
    ownerSide: "playerTwo",
    zoneId: "play",
    cardType: "character",
    strength: 6,
    baseStrength: 6,
    willpower: 8,
    baseWillpower: 8,
    loreValue: 2,
    baseLoreValue: 2,
    readyState: "ready",
    damage: 0,
    ...overrides,
  };
}

describe("CardFace", () => {
  it("hides stat badges when all stats match base values", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot(),
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body).not.toContain('data-testid="card-face-stat-badges"');
    expect(body).not.toContain('data-testid="card-face-stat-badge-strength"');
  });

  it("shows all stat badges when any stat is modified", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({ strength: 10 }),
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body).toContain('data-testid="card-face-stat-badges"');
    expect(body).toContain('data-testid="card-face-stat-badge-strength"');
    expect(body).toContain('data-testid="card-face-stat-badge-willpower"');
    expect(body).toContain('data-testid="card-face-stat-badge-lore"');
    expect(body).toContain(">10</span>");
    expect(body).toContain(">8</span>");
    expect(body).toContain(">2</span>");
  });

  it("renders damage indicator alongside always-on stat badges and tags", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({
          damage: 3,
          strength: 2,
          willpower: 10,
          loreValue: 3,
          readyState: "exerted",
          isDrying: true,
        }),
        damage: 3,
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body).toContain('data-testid="card-face-damage-indicator"');
    expect(body).toContain('data-testid="card-face-stat-badges"');
    expect(body).toContain('data-testid="card-face-stat-badge-strength"');
    expect(body).toContain('data-testid="card-face-stat-badge-willpower"');
    expect(body).toContain('data-testid="card-face-stat-badge-lore"');
    expect(body).toContain(">2</span>");
    expect(body).toContain(">10</span>");
    expect(body).toContain(">3</span>");
    expect(body).toContain('data-testid="card-face-tag-strip"');
    expect(body).toContain('aria-label="Fresh Ink"');
    expect(body).toContain('aria-label="Exerted"');
  });

  it("renders stat badges in strength-willpower-lore order", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({ strength: 10 }),
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body.indexOf('data-testid="card-face-stat-badge-strength"')).toBeLessThan(
      body.indexOf('data-testid="card-face-stat-badge-willpower"'),
    );
    expect(body.indexOf('data-testid="card-face-stat-badge-willpower"')).toBeLessThan(
      body.indexOf('data-testid="card-face-stat-badge-lore"'),
    );
  });

  it("colors stat badges based on modifiers", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({
          strength: 10,
          willpower: 6,
        }),
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body).toContain('data-testid="card-face-stat-badge-strength"');
    // strength buffed (10 vs base 6) -> emerald
    expect(body).toContain("bg-emerald-500/16");
    // willpower debuffed (6 vs base 8) -> amber
    expect(body).toContain("bg-amber-500/18");
    // lore unchanged (2 vs base 2) -> neutral sky
    expect(body).toContain("bg-sky-500/16");
  });

  it("shows only willpower and lore for locations when modified", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({
          cardType: "location",
          strength: undefined,
          baseStrength: undefined,
          willpower: 7,
          baseWillpower: 5,
          loreValue: 1,
          baseLoreValue: 1,
        }),
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body).toContain('data-testid="card-face-stat-badges"');
    expect(body).not.toContain('data-testid="card-face-stat-badge-strength"');
    expect(body).toContain('data-testid="card-face-stat-badge-willpower"');
    expect(body).toContain('data-testid="card-face-stat-badge-lore"');
  });

  it("always shows the lore badge for locations even when their stats are unchanged", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({
          cardType: "location",
          strength: undefined,
          baseStrength: undefined,
          willpower: 5,
          baseWillpower: 5,
          loreValue: 2,
          baseLoreValue: 2,
        }),
        displayWidth: 132,
        displayHeight: 184,
        aspectRatio: 734 / 1024,
      },
    });

    expect(body).toContain('data-testid="card-face-stat-badges"');
    expect(body).not.toContain('data-testid="card-face-stat-badge-strength"');
    expect(body).not.toContain('data-testid="card-face-stat-badge-willpower"');
    expect(body).toContain('data-testid="card-face-stat-badge-lore"');
    expect(body).toContain(">2</span>");
  });

  it("uses the art-only asset path when requested", () => {
    const { body } = render(CardFaceTestHost, {
      props: {
        card: createCardSnapshot({
          set: "004",
          cardNumber: 128,
        }),
        displayWidth: 132,
        displayHeight: 108,
        imageFormat: "art_only",
        aspectRatio: 734 / 602,
      },
    });

    expect(body).toContain("https://new-cdn.lorcanito.com/public/lorcana/004/art_only/128.webp");
  });
});
