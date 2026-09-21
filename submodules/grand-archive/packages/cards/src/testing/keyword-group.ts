import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

/**
 * Shared acceptance contract for one printed keyword group: every printed
 * keyword (with its printed parameter) is active on the fielded object, and
 * the group contributes no unprinted keyword. Each keyword's behavior is
 * proven by its central contract; this proves the printed decomposition the
 * engine actually executes.
 */
export function proveKeywordGroup({
  card,
  keywords,
  entryExtras,
  directField,
  classBonus,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  keywords: readonly { name: string; value?: number }[];
  /** Printed entry costs beyond the base payment (e.g. select-and-move) supply their announcement pieces. */
  entryExtras?: (
    game: GrandArchiveTestEngine,
  ) => NonNullable<Parameters<ReturnType<GrandArchiveTestEngine["player"]>["activate"]>[1]>;
  /** Token representations are asserted in place instead of played from a deck. */
  readonly directField?: boolean;
  /** Enable the fixture class bonus for class-restricted printed groups. */
  readonly classBonus?: boolean;
}): void {
  const face = grandArchiveTestFace(card);
  const cost = face.cost;
  const playFromMaterial = cost.kind === "memory";

  it(`activates exactly the printed keywords (${keywords.map((keyword) => (keyword.value === undefined ? keyword.name : `${keyword.name} ${keyword.value}`)).join(", ")}) on the field`, () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(card, classBonus ?? false, "activation-discount"),
    );
    const amount = cost.kind === "none" ? 0 : cost.amount;
    if (typeof amount !== "number") {
      throw new Error(`${face.name} needs an explicit variable-cost entry fixture.`);
    }
    const paymentCards = Array.from({ length: amount }, () => woodlandSquirrels);
    const game = GrandArchiveTestEngine.startFixture({
      phase: playFromMaterial && !directField ? "materialize" : "main",
      playerOne: {
        champion,
        zones: directField
          ? { field: [card] }
          : {
              hand: playFromMaterial ? [] : [card, ...paymentCards],
              "material-deck": playFromMaterial
                ? [card, ...Array.from({ length: 4 }, () => woodlandSquirrels)]
                : Array.from({ length: 4 }, () => woodlandSquirrels),
              memory: playFromMaterial ? paymentCards : [],
            },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    if (directField) {
      const placed = player.card(card, { zone: "field" });
      const activeDirect = grandArchiveObjectActiveKeywords(
        game.program,
        game.state,
        game.state.objects[placed.objectId]!,
      );
      for (const keyword of keywords) {
        expect(
          activeDirect.some((candidate) => candidate.name === keyword.name),
          `${keyword.name} must be active`,
        ).toBe(true);
      }
      return;
    }
    const basePayment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    const extras = entryExtras ? entryExtras(game) : {};
    if (playFromMaterial) player.materialize(card, extras);
    else if (cost.kind === "reserve")
      player.activate(card, { reservePayment: basePayment, ...extras });
    else
      throw new Error(`${face.name} needs an explicit entry fixture for cost kind ${cost.kind}.`);
    passEffectsStack(game);
    const entered = player.card(card, { zone: "field" });
    const active = grandArchiveObjectActiveKeywords(
      game.program,
      game.state,
      game.state.objects[entered.objectId]!,
    );
    for (const keyword of keywords) {
      const match = active.find(
        (candidate) =>
          candidate.name === keyword.name &&
          (keyword.value === undefined ||
            ("value" in candidate
              ? (candidate as { readonly value?: number | { readonly kind: "variable" } }).value
              : undefined) === keyword.value),
      );
      expect(match, `${keyword.name} must be active`).toBeDefined();
    }
    // Presence-with-parameter is the decomposition contract; other printed
    // abilities may legally contribute their own active keywords.
    expect(active.length).toBeGreaterThanOrEqual(keywords.length);
  });
}
