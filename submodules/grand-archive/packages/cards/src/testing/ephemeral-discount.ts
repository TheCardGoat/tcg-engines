import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { evercurrentRaider } from "../cards/DTR/allies/evercurrent-raider.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

/** Establish ephemeral objects by paying Ephemerate, including an opposing object. */
export function ephemeralDiscountFixture(
  card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  count: number,
) {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(card, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          card,
          fireball,
          fireball,
          fireball,
          fireball,
          ...Array.from({ length: 26 }, () => woodlandSquirrels),
        ],
        field: [giantTortoise],
        graveyard: Array.from({ length: count + 1 }, () => evercurrentRaider),
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [woodlandSquirrels, woodlandSquirrels],
        graveyard: [evercurrentRaider],
        field: [trainingSword],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  advanceToMain(game, q.id);
  const opposing = q.card(evercurrentRaider);
  q.activate(opposing, {
    activationMethod: "ephemerate",
    reservePayment: q
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  advanceToMain(game, p.id);
  const payment = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const own = p.cards(evercurrentRaider, { zone: "graveyard" }).slice(0, count);
  for (const ally of own) {
    p.activate(ally, { activationMethod: "ephemerate", reservePayment: payment(2) });
    passEffectsStack(game);
  }
  return { game, p, q, champion, payment, own, opposing };
}
