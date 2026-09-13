import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCardFilter,
} from "@tcg/grand-archive-types";
import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import {
  GrandArchiveTestEngine,
  type GrandArchivePlayerHandle,
} from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { galesMare } from "../cards/RDO/allies/gales-mare.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";

type Preparation = "ordinary" | "rested-ally" | "stack-target";

interface ClassBonusActivationDiscountExample {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly discount: number;
  readonly preparation?: Preparation;
}

function fixedReserveCost(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>): number {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve") throw new Error(`${face.name} must have a reserve cost.`);
  if (typeof face.cost.amount !== "number") {
    throw new Error(`${face.name} must have a fixed reserve cost.`);
  }
  return face.cost.amount;
}

function positiveFilterLeaves(
  filter: GrandArchiveCardFilter | undefined,
): readonly GrandArchiveCardFilter[] {
  if (!filter || filter.kind === "not") return [];
  if (filter.kind === "all" || filter.kind === "any") {
    return filter.filters.flatMap(positiveFilterLeaves);
  }
  return [filter];
}

function announcementTargets(
  game: GrandArchiveTestEngine,
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
): Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined {
  const player = game.player("player-one");
  const declarations = grandArchiveTestFace(card).abilities.flatMap((ability) =>
    ability.kind === "card-resolution" ? (ability.targets ?? []) : [],
  );
  if (declarations.length === 0) return undefined;

  const targets: Record<string, readonly GrandArchiveTargetId[]> = {};
  for (const declaration of declarations) {
    if (declaration.count.kind === "up-to" || declaration.count.kind === "any-number") {
      targets[declaration.id] = [];
      continue;
    }
    switch (declaration.candidates.kind) {
      case "object": {
        const filters = positiveFilterLeaves(declaration.candidates.filter);
        const targetsPotion = filters.some(
          (filter) => filter.kind === "subtype" && filter.oneOf.includes("POTION"),
        );
        const targetsChampion = filters.some(
          (filter) => filter.kind === "type" && filter.oneOf.includes("CHAMPION"),
        );
        const targetsAlly = filters.some(
          (filter) => filter.kind === "type" && filter.oneOf.includes("ALLY"),
        );
        if (targetsPotion) {
          targets[declaration.id] = [player.card(potionOfHealing, { zone: "field" }).objectId];
        } else if (targetsChampion && !targetsAlly) {
          targets[declaration.id] = [
            player.card(
              createClassBonusTestChampion(card, classBonusEnabled, "activation-discount"),
              {
                zone: "field",
              },
            ).objectId,
          ];
        } else {
          targets[declaration.id] = [player.card(galesMare, { zone: "field" }).objectId];
        }
        break;
      }
      case "player":
        targets[declaration.id] = [
          Array.isArray(declaration.candidates.players) &&
          declaration.candidates.players.includes("opponent")
            ? game.player("player-two").id
            : player.id,
        ];
        break;
      case "stack-item": {
        const stackItem = game.state.stack.at(-1);
        if (!stackItem)
          throw new Error(`${grandArchiveTestFace(card).name} requires a stack target.`);
        targets[declaration.id] = [stackItem.id];
        break;
      }
      default:
        throw new Error(
          `${grandArchiveTestFace(card).name} needs an explicit fixture for ${declaration.candidates.kind} targets.`,
        );
    }
  }
  return targets;
}

function activationOptions(
  game: GrandArchiveTestEngine,
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  reserveCost: number,
): NonNullable<Parameters<GrandArchivePlayerHandle["activate"]>[1]> {
  const player = game.player("player-one");
  const targets = announcementTargets(game, card, classBonusEnabled);
  return {
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, reserveCost)
      .map(({ objectId }) => ({ kind: "card", cardId: objectId })),
    ...(targets ? { targets } : {}),
  };
}

function expectExactReserveCost(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  preparation: Preparation,
  reserveCost: number,
): void {
  const successful = setup(card, classBonusEnabled, preparation);
  successful
    .player("player-one")
    .activate(card, activationOptions(successful, card, classBonusEnabled, reserveCost));

  if (reserveCost === 0) return;
  const underpaid = setup(card, classBonusEnabled, preparation);
  expect(() =>
    underpaid
      .player("player-one")
      .activate(card, activationOptions(underpaid, card, classBonusEnabled, reserveCost - 1)),
  ).toThrow();
}

function setup(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  preparation: Preparation,
): GrandArchiveTestEngine {
  const paymentCards = Array.from({ length: fixedReserveCost(card) }, () => woodlandSquirrels);
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: preparation === "stack-target" ? "playerTwo" : "playerOne",
    playerOne: {
      champion: createClassBonusTestChampion(card, classBonusEnabled, "activation-discount"),
      zones: {
        hand: [card, ...paymentCards],
        field: [galesMare, potionOfHealing],
      },
    },
    playerTwo: {
      champion: createClassBonusTestChampion(card, false, "activation-discount"),
      zones: preparation === "stack-target" ? { hand: [woodlandSquirrels] } : undefined,
    },
  });
  if (preparation === "rested-ally") {
    const player = game.player("player-one");
    player.declareAttack(
      player.card(galesMare, { zone: "field" }),
      game
        .player("player-two")
        .card(createClassBonusTestChampion(card, false, "activation-discount"), {
          zone: "field",
        }),
    );
    game.resolveCombatWithoutRetaliation();
  }
  if (preparation === "stack-target") {
    const opponent = game.player("player-two");
    opponent.activate(woodlandSquirrels);
    opponent.pass();
  }
  return game;
}

/** Shared acceptance contract for one printed Class Bonus activation discount. */
export function proveClassBonusActivationDiscount({
  card,
  discount,
  preparation = "ordinary",
}: ClassBonusActivationDiscountExample): void {
  const printedCost = fixedReserveCost(card);

  it(`reduces its legal activation payment by ${discount} while Class Bonus is enabled`, () => {
    expectExactReserveCost(card, true, preparation, Math.max(0, printedCost - discount));
  });

  it("uses its full printed activation payment while Class Bonus is disabled", () => {
    expectExactReserveCost(card, false, preparation, printedCost);
  });
}
