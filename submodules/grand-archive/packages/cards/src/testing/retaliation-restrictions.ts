import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { innocuousDisposer } from "../cards/HVN/allies/innocuous-disposer.ts";
import { vorpalSword } from "../cards/PTM/weapons/vorpal-sword.ts";
import { ghastlySlime } from "../cards/PTM/allies/ghastly-slime.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { strappingConscript } from "../cards/DOA/allies/strapping-conscript.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { meltdown } from "../cards/ALC/actions/meltdown.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
export function proveSubtypeRetaliationRestriction(kind: "disposer" | "sword") {
  const card = kind === "disposer" ? innocuousDisposer : vorpalSword;
  for (const matching of [false, true])
    for (const subtype of ["human", "specter", "animal"] as const)
      for (const zone of ["field", "hand", "banishment"] as const)
        for (const alternate of [false, true])
          for (const remove of kind === "sword" && zone === "field" ? [false, true] : [false]) {
            if (kind === "disposer" && alternate && zone !== "field") continue;
            it(`class=${matching}, defender=${subtype}, source=${zone}, alternate=${alternate}, remove=${remove}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(card, matching, "activation-discount"),
              );
              const selfAttacks = kind === "disposer" && zone === "field" && !alternate;
              const opponentSource = kind === "sword" && alternate;
              const targetCard =
                subtype === "human"
                  ? strappingConscript
                  : subtype === "specter"
                    ? ghastlySlime
                    : giantTortoise;
              const attackerCard = selfAttacks ? innocuousDisposer : giantTortoise;
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    field: [
                      attackerCard,
                      ...(!opponentSource && zone === "field" && !selfAttacks ? [card] : []),
                    ],
                    hand: [
                      ...(!opponentSource && zone === "hand" ? [card] : []),
                      ...(remove
                        ? [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)]
                        : []),
                    ],
                    banishment: !opponentSource && zone === "banishment" ? [card] : [],
                    "main-deck": [woodlandSquirrels],
                  },
                },
                playerTwo: {
                  champion,
                  zones: {
                    field: [targetCard, ...(opponentSource && zone === "field" ? [card] : [])],
                    hand: opponentSource && zone === "hand" ? [card] : [],
                    banishment: opponentSource && zone === "banishment" ? [card] : [],
                    "main-deck": [woodlandSquirrels],
                  },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                attacker = p.card(attackerCard),
                target = q.card(targetCard);
              if (remove) {
                const source = (opponentSource ? q : p).card(card);
                p.activate(meltdown, {
                  targets: { "target-1": [source.objectId] },
                  reservePayment: p
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                });
                passEffectsStack(game);
                expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
              }
              const forbidden =
                !remove &&
                zone === "field" &&
                (kind === "sword" ? subtype === "specter" : selfAttacks && subtype === "human");
              p.declareAttack(attacker, target);
              let offered = false;
              for (
                let i = 0;
                i < 64 && (game.state.combat || game.state.stack.length || game.state.decision);
                i++
              ) {
                const d = game.state.decision;
                if (d?.kind === "choose-retaliators") {
                  const available = d.candidates.includes(target.objectId);
                  expect(available).toBe(!forbidden);
                  offered = available;
                  answerDecision(game, d.kind, available ? [target.objectId] : []);
                } else if (d?.kind === "resolve-optional-effect")
                  answerDecision(game, d.kind, false);
                else {
                  const wait = game.waitState();
                  if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
                  game.player(wait.playerId).pass();
                }
              }
              expect(game.state.combat).toBeNull();
              expect(offered).toBe(!forbidden);
              const damage = forbidden ? 0 : subtype === "animal" ? 1 : 2;
              expect(game.state.objects[attacker.objectId]!.zone).toBe(
                selfAttacks && damage > 0 ? "graveyard" : "field",
              );
              if (!selfAttacks || damage === 0)
                expect(game.state.objects[attacker.objectId]!.damage).toBe(damage);
            });
          }
}
