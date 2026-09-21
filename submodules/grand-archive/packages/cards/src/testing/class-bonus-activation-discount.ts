import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import {
  GrandArchiveTestEngine,
  type GrandArchivePlayerHandle,
} from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { galesMare } from "../cards/RDO/allies/gales-mare.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { blissfulCalling } from "../cards/DOA/actions/blissful-calling.ts";
import { lumberingSteed } from "../cards/AMB/allies/lumbering-steed.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { announcementTargets, modeSelection } from "./activation-announcement.ts";

type Preparation =
  | "ordinary"
  | "rested-ally"
  | "stack-target"
  | "attacking-enemy-ally"
  /** An opposing ACTION card activation sits on the Effects Stack. */
  | "stack-action"
  /** An opposing activated ability sits on the Effects Stack. */
  | "stack-ability";

interface ClassBonusActivationDiscountExample {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly discount: number;
  readonly preparation?: Preparation;
  /** Grants the fixture champion +N levels so level-gated resolutions are active. */
  readonly championLevel?: number;
}

function fixedReserveCost(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>): number {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve") throw new Error(`${face.name} must have a reserve cost.`);
  if (typeof face.cost.amount !== "number") {
    throw new Error(`${face.name} must have a fixed reserve cost.`);
  }
  return face.cost.amount;
}

/**
 * Exalted cannot enable itself (Special Elements / Exalted 1): it requires a
 * champion that enables another advanced element, so fixture champions for
 * Exalted cards enable the full element set.
 */
function exampleChampion(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  championLevel: number,
) {
  let champion = createClassBonusTestChampion(card, classBonusEnabled, "activation-discount");
  if (grandArchiveTestFace(card).elements.includes("EXALTED")) {
    champion = enableAllTestElements(champion);
  }
  if (championLevel > 0) champion = grantTestChampionLevel(champion, championLevel);
  return champion;
}

function activationOptions(
  game: GrandArchiveTestEngine,
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  reserveCost: number,
  champion: ReturnType<typeof exampleChampion>,
  preparation: Preparation,
  championLevel: number,
): NonNullable<Parameters<GrandArchivePlayerHandle["activate"]>[1]> {
  const player = game.player("player-one");
  const targets = announcementTargets(game, card, champion, preparation, championLevel);
  const modeIds = modeSelection(card);
  const attackAttackerId = grandArchiveTestFace(card).typeLine.types.includes("ATTACK")
    ? player.card(champion, { zone: "field" }).objectId
    : undefined;
  return {
    ...(attackAttackerId ? { attackAttackerId } : {}),
    ...(modeIds.length > 0 ? { modeIds } : {}),
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
  championLevel: number,
): void {
  const champion = exampleChampion(card, classBonusEnabled, championLevel);
  const successful = setup(card, champion, preparation);
  successful
    .player("player-one")
    .activate(
      card,
      activationOptions(
        successful,
        card,
        classBonusEnabled,
        reserveCost,
        champion,
        preparation,
        championLevel,
      ),
    );

  if (reserveCost === 0) return;
  const underpaid = setup(card, champion, preparation);
  expect(() =>
    underpaid
      .player("player-one")
      .activate(
        card,
        activationOptions(
          underpaid,
          card,
          classBonusEnabled,
          reserveCost - 1,
          champion,
          preparation,
          championLevel,
        ),
      ),
  ).toThrow();
}

function setup(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  champion: ReturnType<typeof exampleChampion>,
  preparation: Preparation,
): GrandArchiveTestEngine {
  const paymentCards = Array.from({ length: fixedReserveCost(card) }, () => woodlandSquirrels);
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer:
      preparation === "stack-target" ||
      preparation === "attacking-enemy-ally" ||
      preparation === "stack-action" ||
      preparation === "stack-ability"
        ? "playerTwo"
        : "playerOne",
    playerOne: {
      champion,
      zones: {
        hand: [card, ...paymentCards],
        field: [galesMare, potionOfHealing],
      },
    },
    playerTwo: {
      champion,
      zones: {
        ...(preparation === "stack-target" ? { hand: [woodlandSquirrels] } : {}),
        ...(preparation === "attacking-enemy-ally" ? { field: [galesMare] } : {}),
        ...(preparation === "stack-action" ? { hand: [blissfulCalling, woodlandSquirrels] } : {}),
        ...(preparation === "stack-ability"
          ? { field: [lumberingSteed], hand: [woodlandSquirrels, woodlandSquirrels] }
          : {}),
      },
    },
  });
  if (preparation === "rested-ally") {
    const player = game.player("player-one");
    player.declareAttack(
      player.card(galesMare, { zone: "field" }),
      game.player("player-two").card(champion, { zone: "field" }),
    );
    game.resolveCombatWithoutRetaliation();
  }
  if (preparation === "stack-target") {
    const opponent = game.player("player-two");
    opponent.activate(woodlandSquirrels);
    opponent.pass();
  }
  if (preparation === "stack-action") {
    const opponent = game.player("player-two");
    const [payment] = opponent.cards(woodlandSquirrels, { zone: "hand" });
    if (!payment) throw new Error("stack-action preparation lacks its reserve payment.");
    opponent.activate(blissfulCalling, {
      reservePayment: [{ kind: "card", cardId: payment.objectId }],
    });
    opponent.pass();
  }
  if (preparation === "stack-ability") {
    const opponent = game.player("player-two");
    const payments = opponent.cards(woodlandSquirrels, { zone: "hand" });
    if (payments.length < 2)
      throw new Error("stack-ability preparation lacks its reserve payment.");
    opponent.activateAbility(lumberingSteed, "ic1ahsmwd0-a2", {
      reservePayment: payments
        .slice(0, 2)
        .map(({ objectId }) => ({ kind: "card", cardId: objectId })),
    });
    opponent.pass();
  }
  if (preparation === "attacking-enemy-ally") {
    const player = game.player("player-one"),
      opponent = game.player("player-two");
    opponent.declareAttack(
      opponent.card(galesMare, { zone: "field" }),
      player.card(champion, { zone: "field" }),
    );
    for (let step = 0; step < 8 && game.state.combat; step += 1) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity" || wait.playerId !== opponent.id) break;
      opponent.pass();
    }
  }
  return game;
}

/** Shared acceptance contract for one printed Class Bonus activation discount. */
export function proveClassBonusActivationDiscount({
  card,
  discount,
  preparation = "ordinary",
  championLevel = 0,
}: ClassBonusActivationDiscountExample): void {
  const printedCost = fixedReserveCost(card);

  it(`reduces its legal activation payment by ${discount} while Class Bonus is enabled`, () => {
    expectExactReserveCost(
      card,
      true,
      preparation,
      Math.max(0, printedCost - discount),
      championLevel,
    );
  });

  it("uses its full printed activation payment while Class Bonus is disabled", () => {
    expectExactReserveCost(card, false, preparation, printedCost, championLevel);
  });
}
