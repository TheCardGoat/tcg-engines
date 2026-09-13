import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { nimueCursedTouch } from "./nimue-cursed-touch.ts";
import { fireball } from "../actions/fireball.ts";
import { freezeStiff } from "../actions/freeze-stiff.ts";
import { baubleOfMending } from "../items/bauble-of-mending.ts";
/** @covers l52lVIFvpy-a1 */
describe("Nimue destroys action-targeted allies before resolution, only for its matching controller", () => {
  for (const bonus of [false, true])
    for (const kind of [
      "own-ally",
      "foe-ally",
      "champion",
      "opponent",
      "ability",
      "two-allies",
    ] as const)
      it(`class=${bonus}, activation=${kind}`, () => {
        const base = createClassBonusTestChampion(nimueCursedTouch, bonus, "activation-discount"),
          champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), elements: ["FIRE" as const, "WATER" as const] },
            },
          };
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: kind === "opponent" ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [nimueCursedTouch, giantTortoise, baubleOfMending],
              hand: [fireball, freezeStiff, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise],
              hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          own = p.card(giantTortoise),
          foe = q.card(giantTortoise),
          hero = q.card(champion),
          caster = kind === "opponent" ? q : p;
        const target = kind === "foe-ally" ? foe : kind === "champion" ? hero : own;
        const expected = bonus && kind !== "champion" && kind !== "opponent" && kind !== "ability";
        if (kind === "ability")
          p.activateAbility(baubleOfMending, "hLHpI5rHIK-a1", {
            targets: { "target-1": [own.objectId] },
          });
        else if (kind === "two-allies")
          p.activate(freezeStiff, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-allies": [own.objectId, foe.objectId] },
          });
        else
          caster.activate(fireball, {
            reservePayment: caster
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, bonus ? 2 : 4)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [target.objectId] },
          });
        if (expected) {
          expect(
            game.state.stack.some(
              (s) => s.kind === "triggered-ability" && s.ability.id === "l52lVIFvpy-a1",
            ),
          ).toBe(true);
          for (let i = 0; i < 20 && game.state.stack.length > 1; i++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error("Unexpected trigger choice");
            game.player(wait.playerId).pass();
          }
          expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          if (kind === "two-allies")
            expect(game.state.objects[foe.objectId]!.zone).toBe("graveyard");
          expect(game.state.stack).toHaveLength(kind === "two-allies" ? 1 : 0);
        }
        passEffectsStack(game);
        if (!expected) {
          expect(game.state.objects[own.objectId]!.zone).toBe("field");
          expect(game.state.objects[foe.objectId]!.zone).toBe("field");
        }
        if (kind !== "ability" && kind !== "two-allies")
          expect(game.state.objects[target.objectId]!.damage).toBe(expected ? 0 : 1);
      });
});

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
/** @covers l52lVIFvpy-a1 */
for (const returns of [false, true])
  it(`Nimue does not destroy a target after it leaves the field, returns=${returns}`, () => {
    const base = createClassBonusTestChampion(nimueCursedTouch, true, "activation-discount");
    const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
      ...base,
      layout: {
        kind: "single-faced",
        face: {
          ...requireSingleFace(base),
          elements: ["WATER"],
          abilities: [
            {
              id: "blinkTarget-a1",
              kind: "activated",
              activation: "ability",
              cost: { kind: "pay-reserve", amount: 0 },
              text: "Move the tortoise out of the field, then optionally return it.",
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        filter: { kind: "name", value: "Giant Tortoise", match: "exact" },
                      },
                    },
                    destination: { zone: "banishment" },
                  },
                  ...(returns
                    ? [
                        {
                          kind: "move" as const,
                          subject: {
                            kind: "each" as const,
                            collection: {
                              zones: ["banishment" as const],
                              filter: {
                                kind: "name" as const,
                                value: "Giant Tortoise",
                                match: "exact" as const,
                              },
                            },
                          },
                          destination: { zone: "field" as const },
                        },
                      ]
                    : []),
                ],
              },
            },
          ],
        },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [nimueCursedTouch, giantTortoise],
          hand: [freezeStiff, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      target = p.card(giantTortoise),
      incarnation = game.state.objects[target.objectId]!.incarnation;
    p.activate(freezeStiff, {
      reservePayment: p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      targets: { "target-allies": [target.objectId] },
    });
    expect(
      game.state.stack.some(
        (s) => s.kind === "triggered-ability" && s.ability.id === "l52lVIFvpy-a1",
      ),
    ).toBe(true);
    p.activateAbility(champion, "blinkTarget-a1");
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.incarnation).toBeGreaterThan(incarnation);
    expect(game.state.objects[target.objectId]!.zone).toBe(returns ? "field" : "banishment");
  });

/** @covers l52lVIFvpy-a1 */
it("does not destroy an ally card targeted in hand", () => {
  const champion = createClassBonusTestChampion(nimueCursedTouch, true, "activation-discount");
  const action: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
    canonicalId: "offFieldTarget",
    slug: "off-field-target",
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: "offFieldTarget:face:default",
        catalogId: "offFieldTarget",
        name: "Off-field target",
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: "slow",
        stats: {},
        rulesText: "Target an ally card in hand.",
        abilities: [
          {
            id: "offFieldTarget-a1",
            kind: "card-resolution",
            text: "Target an ally card in hand.",
            targets: [
              {
                id: "allyCard",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
            ],
            effect: { kind: "draw", player: "controller", amount: 0 },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { champion, zones: { field: [nimueCursedTouch], hand: [action, giantTortoise] } },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    target = p.card(giantTortoise);
  p.activate(action, { targets: { allyCard: [target.objectId] } });
  passEffectsStack(game);
  expect(game.state.objects[target.objectId]!.zone).toBe("hand");
});
