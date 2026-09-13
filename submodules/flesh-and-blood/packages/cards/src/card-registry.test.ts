import { describe, expect, it } from "vitest";
import {
  walkAbilityEffects,
  type FleshAndBloodAbility,
  type FleshAndBloodCard,
} from "@tcg/flesh-and-blood-types";
import { thawRed } from "./cards/actions/thaw.ts";
import { twinTwistersRedI18n } from "./cards/actions/twin-twisters.i18n.ts";
import { twinTwistersRed } from "./cards/actions/twin-twisters.ts";
import { bravo } from "./cards/heroes/bravo.ts";
import {
  CARD_I18N_BY_CANONICAL_ID,
  STRUCTURED_CARDS_BY_CANONICAL_ID,
} from "./generated/card-registry.generated.ts";
import { localizeFleshAndBloodCard } from "./localization.ts";

describe("generated canonical FAB card corpus", () => {
  it("contains only authored cards with no unparsed executable fallback", () => {
    expect(STRUCTURED_CARDS_BY_CANONICAL_ID.size).toBeGreaterThan(0);
    for (const _card of STRUCTURED_CARDS_BY_CANONICAL_ID.values()) {
    }
  });

  it("models every printed random-discard additional cost as random", () => {
    const gaps: string[] = [];
    const bindingGaps: string[] = [];
    for (const card of STRUCTURED_CARDS_BY_CANONICAL_ID.values()) {
      const printedText = CARD_I18N_BY_CANONICAL_ID.get(card.canonicalId)?.locales.en.text ?? "";
      const requiresRandomDiscard =
        printedText.includes("additional cost") && printedText.includes("discard a random card");
      const hasRandomDiscardAdditionalCost = (card.base.abilities ?? []).some(
        (ability) =>
          ability.kind === "static" &&
          ability.staticKind === "play" &&
          ability.playEffect?.cost?.class === "effect" &&
          ability.playEffect.cost.type === "discard" &&
          ability.playEffect.cost.random === true,
      );
      if (requiresRandomDiscard && !hasRandomDiscardAdditionalCost) gaps.push(card.slug);
      for (const ability of card.base.abilities ?? []) {
        if (
          hasRandomDiscardAdditionalCost &&
          ability.condition?.type === "binding-matches" &&
          ability.condition.binding !== "discardedCard"
        ) {
          bindingGaps.push(`${card.slug}:${ability.id}`);
        }
      }
    }
    expect(gaps).toEqual([]);
    expect(bindingGaps).toEqual([]);
  });

  it("hydrates player-consumed ability and modal labels for every generated card", () => {
    for (const card of STRUCTURED_CARDS_BY_CANONICAL_ID.values()) {
      for (const ability of presentationAbilities(card)) {
        assertAbilityPresentation(card, ability);
      }
    }
  });

  it("hydrates a distinct display name for every activated ability on a card", () => {
    for (const card of STRUCTURED_CARDS_BY_CANONICAL_ID.values()) {
      const activated = presentationAbilities(card).filter(
        (ability) => ability.kind === "activated",
      );
      const displayNames = activated.map((ability) => ability.displayName?.trim() ?? "");

      expect(displayNames.every(Boolean), card.slug).toBe(true);
      expect(new Set(displayNames).size, card.slug).toBe(displayNames.length);
    }
  });

  it("hydrates real activated, play-modal, and triggered-modal cards", () => {
    const localizedBravo = requiredCard(bravo.canonicalId);
    const bravoActivation = localizedBravo.base.abilities?.find(
      (ability) => ability.kind === "activated",
    );
    expect(bravoActivation?.text).toContain("Until end of turn");

    const localizedTwinTwisters = requiredCard(twinTwistersRed.canonicalId);
    const twinTwistersModal = localizedTwinTwisters.base.abilities?.find(
      (ability) => ability.kind === "modal",
    );
    expect(twinTwistersModal?.kind).toBe("modal");
    if (twinTwistersModal?.kind === "modal") {
      expect(twinTwistersModal.modes.map((mode) => mode.text)).toEqual([
        "Grant Power To Next Attack On Hit",
        "Gain 1 Power",
      ]);
    }

    const localizedThaw = requiredCard(thawRed.canonicalId);
    const thawTrigger = localizedThaw.base.abilities?.find(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "triggered" &&
        ability.resolution.kind === "modal",
    );
    expect(thawTrigger?.kind).toBe("static");
    if (
      thawTrigger?.kind === "static" &&
      thawTrigger.staticKind === "triggered" &&
      thawTrigger.resolution.kind === "modal"
    ) {
      expect(thawTrigger.resolution.modes.map((mode) => mode.text)).toEqual([
        "Destroy Frostbite",
        "Destroy Ice Affliction",
        "Unfreeze Permanent Or Arsenal",
      ]);
    }
  });

  it("applies exact semantic ability and mode wording overrides", () => {
    const localized = localizeFleshAndBloodCard(twinTwistersRed, {
      ...twinTwistersRedI18n,
      locales: {
        ...twinTwistersRedI18n.locales,
        en: {
          ...twinTwistersRedI18n.locales.en,
          abilities: {
            chooseMode: {
              text: "Choose one Twin Twisters effect.",
              displayName: "Choose an effect",
              modes: { gain1Power: "This attack gets +1 power." },
            },
          },
        },
      },
    });
    const modal = localized.base.abilities?.find((ability) => ability.kind === "modal");
    expect(modal?.text).toBe("Choose one Twin Twisters effect.");
    expect(modal?.displayName).toBe("Choose an effect");
    if (modal?.kind === "modal") {
      expect(modal.modes.find((mode) => mode.id.endsWith(":gain1Power"))?.text).toBe(
        "This attack gets +1 power.",
      );
    }
  });

  it("rejects misspelled semantic localization paths", () => {
    expect(() =>
      localizeFleshAndBloodCard(twinTwistersRed, {
        ...twinTwistersRedI18n,
        locales: {
          en: {
            ...twinTwistersRedI18n.locales.en,
            abilities: { chooseModes: { text: "Typo" } },
          },
        },
      }),
    ).toThrow(/Unknown localization ability path.*chooseModes/);

    expect(() =>
      localizeFleshAndBloodCard(twinTwistersRed, {
        ...twinTwistersRedI18n,
        locales: {
          en: {
            ...twinTwistersRedI18n.locales.en,
            abilities: {
              chooseMode: { modes: { gains1Power: "Typo" } },
            },
          },
        },
      }),
    ).toThrow(/Unknown localization mode path.*gains1Power/);
  });

  it("requires every play-static permission to declare a functional origin", () => {
    const gaps: string[] = [];
    for (const card of STRUCTURED_CARDS_BY_CANONICAL_ID.values()) {
      if (!(card.base.abilities ?? []).some((ability) => ability.kind === "activated")) continue;
      for (const ability of card.base.abilities ?? []) {
        if (
          ability.kind !== "static" ||
          ability.staticKind !== "play" ||
          ability.playEffect?.role !== "permission"
        ) {
          continue;
        }
        if (ability.playEffect.fromZones.length === 0) gaps.push(`${card.slug}:${ability.id}`);
      }
    }

    expect(gaps).toEqual([]);
  });
});

function requiredCard(canonicalId: string): FleshAndBloodCard {
  const card = STRUCTURED_CARDS_BY_CANONICAL_ID.get(canonicalId);
  if (!card) throw new Error(`Missing generated card ${canonicalId}`);
  return card;
}

function presentationAbilities(card: FleshAndBloodCard): readonly FleshAndBloodAbility[] {
  if (card.layout.kind === "split") {
    return [...(card.base.abilities ?? []), ...card.layout.faces.flatMap((face) => face.abilities)];
  }
  if (card.layout.kind !== "single") {
    return [
      ...(card.base.abilities ?? []),
      ...card.layout.front.abilities,
      ...card.layout.back.abilities,
    ];
  }
  return card.base.abilities ?? [];
}

function assertAbilityPresentation(card: FleshAndBloodCard, ability: FleshAndBloodAbility): void {
  expect(ability.text.trim(), `${card.slug}:${ability.id}`).not.toBe("");
  if (ability.kind === "modal") {
    assertDistinctModes(card, ability.id, ability.modes);
    for (const mode of ability.modes) assertAbilityPresentation(card, mode);
  }
  if (
    ability.kind === "static" &&
    ability.staticKind === "triggered" &&
    ability.resolution.kind === "modal"
  ) {
    assertDistinctModes(card, ability.id, ability.resolution.modes);
    for (const mode of ability.resolution.modes) assertAbilityPresentation(card, mode);
  }
  walkAbilityEffects(ability, (effect) => {
    if (effect.type === "grant-property" && effect.property.kind === "ability") {
      assertAbilityPresentation(card, effect.property.ability);
    }
    return effect;
  });
}

function assertDistinctModes(
  card: FleshAndBloodCard,
  abilityId: string,
  modes: readonly Extract<FleshAndBloodAbility, { kind: "resolution" }>[],
): void {
  const labels = modes.map((mode) => mode.text.trim());
  expect(labels.every(Boolean), `${card.slug}:${abilityId}`).toBe(true);
  expect(new Set(labels).size, `${card.slug}:${abilityId}`).toBe(labels.length);
}
