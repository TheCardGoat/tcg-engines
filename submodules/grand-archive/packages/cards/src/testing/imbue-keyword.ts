import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { announcementTargets, modeSelection } from "./activation-announcement.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stellarionShift } from "../cards/DTR/actions/stellarion-shift.ts";
import { galesMare } from "../cards/RDO/allies/gales-mare.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { wrathfulSlime } from "../cards/HVN/allies/wrathful-slime.ts";
import { throneSentinel } from "../cards/MRC/allies/throne-sentinel.ts";

/**
 * Shared acceptance contract for one printed Imbue / Advanced Imbue keyword:
 * reserving revealed payment cards marks the activation imbued exactly when
 * at least the printed threshold of them satisfy the printed element
 * requirement (Keywords and Abilities — Imbue rules 5–6).
 */
export function proveImbueKeyword({
  card,
  cost,
  threshold,
  requirement,
  declaredX,
  donor: donorOverride,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: { kind: "reserve" | "memory"; amount: number };
  threshold: number;
  requirement: "source-elements" | "advanced";
  /** Printed threshold uses X; the declared value proves the chosen boundary. */
  declaredX?: number;
  /** Hand card whose elements satisfy a oneOf requirement. */
  donor?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}): void {
  const effectiveThreshold = declaredX ?? threshold;
  if (cost.kind !== "reserve") {
    throw new Error(
      `${grandArchiveTestFace(card).name} must pay a reserve cost to reveal for Imbue.`,
    );
  }
  if (effectiveThreshold > cost.amount) {
    throw new Error(
      `${grandArchiveTestFace(card).name} cannot reveal more cards than its reserve payment.`,
    );
  }
  // The donor's element must satisfy the requirement: source-element Imbue
  // shares an element with the activated card, Advanced Imbue needs an
  // advanced-element donor, and oneOf requirements name their donor elements.
  const donor = donorOverride ?? (requirement === "advanced" ? stellarionShift : card);
  // The filler must never satisfy the requirement: NORM filler breaks a
  // NORM-source Imbue, so fall back to a wind card there.
  const sourceElements = grandArchiveTestFace(card).elements;
  const filler =
    requirement === "source-elements" && sourceElements.every((element) => element === "NORM")
      ? galesMare
      : woodlandSquirrels;

  function setup() {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(card, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            card,
            ...Array.from({ length: cost.amount }, () => donor),
            ...Array.from({ length: cost.amount }, () => filler),
          ],
          field: [galesMare, potionOfHealing],
        },
      },
      playerTwo: { champion },
    });
    return game;
  }

  function activate(game: GrandArchiveTestEngine, matchingPayment: number, reveal: boolean) {
    const player = game.player("player-one");
    // For source-element Imbue the donor is the card itself, so reserve every
    // copy except the one being activated.
    const source =
      donor === card
        ? player.cards(card, { zone: "hand" }).at(-1)!
        : player.card(card, { zone: "hand" });
    const donors = player
      .cards(donor, { zone: "hand" })
      .filter((candidate) => candidate.objectId !== source.objectId)
      .slice(0, matchingPayment);
    const fillerCards = player
      .cards(filler, { zone: "hand" })
      .slice(0, cost.amount - matchingPayment);
    const championRef = player.card(
      createClassBonusTestChampion(card, false, "activation-discount"),
      { zone: "field" },
    );
    const targets = announcementTargets(game, card, championRef, "ordinary", 0);
    const modeIds = modeSelection(card, {
      activationImbued: reveal && matchingPayment >= effectiveThreshold,
    });
    const attackAttackerId = grandArchiveTestFace(card).typeLine.types.includes("ATTACK")
      ? championRef.objectId
      : undefined;
    player.activate(source, {
      ...(attackAttackerId ? { attackAttackerId } : {}),
      ...(modeIds.length > 0 ? { modeIds } : {}),
      ...(targets ? { targets } : {}),
      ...(declaredX !== undefined ? { variables: { X: declaredX } } : {}),
      ...(reveal ? { revealForImbue: true } : {}),
      reservePayment: [...donors, ...fillerCards].map(({ objectId }) => ({
        kind: "card" as const,
        cardId: objectId,
      })),
    });
    return game.state.stack.at(-1);
  }

  it(`becomes imbued when ${effectiveThreshold} revealed payment cards satisfy the requirement`, () => {
    const item = activate(setup(), effectiveThreshold, true);
    expect(item?.activationStates?.includes("imbued") ?? false).toBe(true);
  });

  it(`does not become imbued when only ${Math.max(0, effectiveThreshold - 1)} revealed payment cards satisfy the requirement`, () => {
    const item = activate(setup(), Math.max(0, effectiveThreshold - 1), true);
    expect(item?.activationStates?.includes("imbued") ?? false).toBe(false);
  });

  it("does not become imbued when the reveal is declined", () => {
    const item = activate(setup(), effectiveThreshold, false);
    expect(item?.activationStates?.includes("imbued") ?? false).toBe(false);
  });
}
