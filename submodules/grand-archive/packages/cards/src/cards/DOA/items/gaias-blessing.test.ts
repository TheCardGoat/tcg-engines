import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { empoweringHarmony } from "../actions/empowering-harmony.ts";
import { excaliburCleansingLight } from "../actions/excalibur-cleansing-light.ts";
import { gaiasBlessing } from "./gaias-blessing.ts";
import { baubleOfMending } from "./bauble-of-mending.ts";
/** @covers ymhDYTPfi1-a1 */
for (const element of [false, true])
  for (const count of [3, 4, 5])
    it(`Gaia activates from material by banishing exactly four own graveyard Animals/Beasts: element=${element},count=${count}`, () => {
      const base = enableAllTestElements(
          createClassBonusTestChampion(gaiasBlessing, false, "activation-discount"),
        ),
        face = requireSingleFace(base),
        champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
          ...base,
          layout: {
            kind: "single-faced",
            face: { ...face, elements: element ? ["TERA"] : ["NORM"] },
          },
        };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            "material-deck": [gaiasBlessing],
            graveyard: [
              ...Array.from({ length: count }, (_, i) => (i % 2 ? grayWolf : woodlandSquirrels)),
              eagerPage,
            ],
            hand: [grayWolf],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { graveyard: [grayWolf] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(gaiasBlessing, { zone: "material-deck" }),
        eligible = p
          .zone("graveyard")
          .filter((c) => c.definitionId !== eagerPage.canonicalId)
          .map((c) => c.objectId),
        chosen = eligible.slice(0, 4),
        before = game.state;
      for (const bad of [
        eligible.slice(0, 3),
        [...chosen.slice(0, 3), q.card(grayWolf).objectId],
        [...chosen.slice(0, 3), p.card(eagerPage).objectId],
        [...chosen.slice(0, 3), p.card(grayWolf, { zone: "hand" }).objectId],
        ...(count === 5 ? [eligible] : []),
      ]) {
        expect(() => p.activate(source, { costSelections: [bad] })).toThrow();
        expect(game.state).toEqual(before);
      }
      if (!element || count < 4) {
        expect(() => p.activate(source, { costSelections: [chosen] })).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activate(source, { costSelections: [chosen] });
      expect(
        p
          .zone("banishment")
          .map((c) => c.objectId)
          .sort(),
      ).toEqual([...chosen].sort());
      expect(p.zone("memory")).toHaveLength(0);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
    });
/** @covers ymhDYTPfi1-a2 @covers ymhDYTPfi1-a3 */
for (const [card, cost, allowed] of [
  [woodlandSquirrels, 0, true],
  [grayWolf, 2, true],
  [eagerPage, 3, false],
  [empoweringHarmony, 2, false],
] as const)
  it(`Gaia reveals only the changing top card and grants only Animal/Beast ally activation: ${card.slug}`, () => {
    const champion = enableAllTestElements(
        grantTestChampionLevel(
          createClassBonusTestChampion(gaiasBlessing, false, "activation-discount"),
          2,
        ),
      ),
      game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [gaiasBlessing, baubleOfMending],
            hand: [excaliburCleansingLight, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
            "main-deck": [card, card, card],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [card] } },
      });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      deck = p.zone("main-deck"),
      top = deck[0]!,
      below = deck[1]!;
    const visible = () => {
      const zone = q.view().players.find((player) => player.id === p.id)!.zones["main-deck"];
      if (zone.visibility !== "hidden") throw new Error("Opponent deck must remain private");
      return zone.revealedObjects.map((c) => c.id);
    };
    expect(visible()).toEqual([top.objectId]);
    const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      before = game.state;
    for (const invalid of [below, q.zone("main-deck")[0]!]) {
      expect(() => p.activate(invalid, { reservePayment: payment })).toThrow();
      expect(game.state).toEqual(before);
    }
    if (allowed) {
      if (cost) {
        expect(() => p.activate(top, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(top, { reservePayment: payment });
      passEffectsStack(game);
      expect(game.state.objects[top.objectId]!.zone).toBe("field");
    } else {
      expect(() => p.activate(top, { reservePayment: payment })).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(baubleOfMending, "hLHpI5rHIK-a1");
      passEffectsStack(game);
      expect(game.state.objects[top.objectId]!.zone).toBe("hand");
    }
    expect(visible()).toEqual([below.objectId]);
    p.activate(excaliburCleansingLight, {
      targets: { "target-1": [p.card(gaiasBlessing).objectId] },
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(p.card(gaiasBlessing, { zone: "banishment" })).toBeDefined();
    expect(visible()).toEqual([]);
    expect(() =>
      p.activate(below, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      }),
    ).toThrow();
  });
