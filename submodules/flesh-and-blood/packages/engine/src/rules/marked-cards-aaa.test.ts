import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/** Public AAA regressions for authored cards that reference CR 9.3 Marked. */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "./fixtures.ts";
import { markOfTheBlackWidowRed } from "../../../cards/src/cards/actions/mark-of-the-black-widow.ts";
import { markOfTheBlackWidowYellow } from "../../../cards/src/cards/actions/mark-of-the-black-widow.ts";
import { markOfTheBlackWidowBlue } from "../../../cards/src/cards/actions/mark-of-the-black-widow.ts";
import { forTheDracaiRed } from "../../../cards/src/cards/actions/for-the-dracai.ts";
import { forTheEmperorRed } from "../../../cards/src/cards/actions/for-the-emperor.ts";
import { forTheRealmRed } from "../../../cards/src/cards/actions/for-the-realm.ts";
import { publicBountyRed } from "../../../cards/src/cards/actions/public-bounty.ts";
import { publicBountyYellow } from "../../../cards/src/cards/actions/public-bounty.ts";
import { publicBountyBlue } from "../../../cards/src/cards/actions/public-bounty.ts";
import { pointOfEngagementRed } from "../../../cards/src/cards/actions/point-of-engagement.ts";
import { pointOfEngagementYellow } from "../../../cards/src/cards/actions/point-of-engagement.ts";
import { pointOfEngagementBlue } from "../../../cards/src/cards/actions/point-of-engagement.ts";
import { markOfTheFunnelWebRed } from "../../../cards/src/cards/actions/mark-of-the-funnel-web.ts";
import { markOfTheFunnelWebYellow } from "../../../cards/src/cards/actions/mark-of-the-funnel-web.ts";
import { markOfTheFunnelWebBlue } from "../../../cards/src/cards/actions/mark-of-the-funnel-web.ts";
import { knifeThroughButterRed } from "../../../cards/src/cards/actions/knife-through-butter.ts";
import { knifeThroughButterYellow } from "../../../cards/src/cards/actions/knife-through-butter.ts";
import { knifeThroughButterBlue } from "../../../cards/src/cards/actions/knife-through-butter.ts";
import { harmonizedKodachi } from "../../../cards/src/cards/weapons/harmonized-kodachi.ts";
import { markThePreyRed } from "../../../cards/src/cards/actions/mark-the-prey.ts";
import { markThePreyYellow } from "../../../cards/src/cards/actions/mark-the-prey.ts";
import { markThePreyBlue } from "../../../cards/src/cards/actions/mark-the-prey.ts";
import { trapAndReleaseRed } from "../../../cards/src/cards/actions/trap-and-release.ts";
import { trapAndReleaseYellow } from "../../../cards/src/cards/actions/trap-and-release.ts";
import { trapAndReleaseBlue } from "../../../cards/src/cards/actions/trap-and-release.ts";
import { tagTheTargetRed } from "../../../cards/src/cards/actions/tag-the-target.ts";
import { tagTheTargetYellow } from "../../../cards/src/cards/actions/tag-the-target.ts";
import { tagTheTargetBlue } from "../../../cards/src/cards/actions/tag-the-target.ts";
import { pursueToTheEdgeOfOblivionRed } from "../../../cards/src/cards/actions/pursue-to-the-edge-of-oblivion.ts";
import { pursueToThePitsOfDespairRed } from "../../../cards/src/cards/actions/pursue-to-the-pits-of-despair.ts";
import { relentlessPursuitBlue } from "../../../cards/src/cards/actions/relentless-pursuit.ts";
import { proclaimVengeanceRed } from "../../../cards/src/cards/instants/proclaim-vengeance.ts";
import { reaperSCallRed } from "../../../cards/src/cards/actions/reaper-s-call.ts";
import { reaperSCallYellow } from "../../../cards/src/cards/actions/reaper-s-call.ts";
import { reaperSCallBlue } from "../../../cards/src/cards/actions/reaper-s-call.ts";
import { tipOffRed } from "../../../cards/src/cards/actions/tip-off.ts";
import { tipOffYellow } from "../../../cards/src/cards/actions/tip-off.ts";
import { tipOffBlue } from "../../../cards/src/cards/actions/tip-off.ts";
import { swornVengeanceRed } from "../../../cards/src/cards/actions/sworn-vengeance.ts";
import { swornVengeanceYellow } from "../../../cards/src/cards/actions/sworn-vengeance.ts";
import { huntAKillerBlue } from "../../../cards/src/cards/actions/hunt-a-killer.ts";
import { swornVengeanceBlue } from "../../../cards/src/cards/actions/sworn-vengeance.ts";
import { huntAKillerRed } from "../../../cards/src/cards/actions/hunt-a-killer.ts";
import { huntAKillerYellow } from "../../../cards/src/cards/actions/hunt-a-killer.ts";
import { outedRed } from "../../../cards/src/cards/actions/outed.ts";
import { whittleFromBoneRed } from "../../../cards/src/cards/actions/whittle-from-bone.ts";
import { whittleFromBoneYellow } from "../../../cards/src/cards/actions/whittle-from-bone.ts";
import { whittleFromBoneBlue } from "../../../cards/src/cards/actions/whittle-from-bone.ts";
import { huntToTheEndsOfRatheRed } from "../../../cards/src/cards/actions/hunt-to-the-ends-of-rathe.ts";
import { arakni } from "../../../cards/src/cards/heroes/arakni.ts";
import { cindraDracaiOfRetribution } from "../../../cards/src/cards/heroes/cindra-dracai-of-retribution.ts";
import { fangDracaiOfBlades } from "../../../cards/src/cards/heroes/fang-dracai-of-blades.ts";
import { cindra } from "../../../cards/src/cards/heroes/cindra.ts";
import { fang } from "../../../cards/src/cards/heroes/fang.ts";
import { grapheneChelicera } from "../../../cards/src/cards/weapons/graphene-chelicera.ts";
import { markOfTheHuntsman } from "../../../cards/src/cards/weapons/mark-of-the-huntsman.ts";
import { toThePointRed } from "../../../cards/src/cards/attack-reactions/to-the-point.ts";
import { toThePointYellow } from "../../../cards/src/cards/attack-reactions/to-the-point.ts";
import { toThePointBlue } from "../../../cards/src/cards/attack-reactions/to-the-point.ts";
import { plungeTheProspectRed } from "../../../cards/src/cards/actions/plunge-the-prospect.ts";
import { plungeTheProspectYellow } from "../../../cards/src/cards/actions/plunge-the-prospect.ts";
import { plungeTheProspectBlue } from "../../../cards/src/cards/actions/plunge-the-prospect.ts";
import { scuttleTheCanalRed } from "../../../cards/src/cards/actions/scuttle-the-canal.ts";
import { scuttleTheCanalYellow } from "../../../cards/src/cards/actions/scuttle-the-canal.ts";
import { scuttleTheCanalBlue } from "../../../cards/src/cards/actions/scuttle-the-canal.ts";
import { scarTissueRed } from "../../../cards/src/cards/attack-reactions/scar-tissue.ts";
import { scarTissueYellow } from "../../../cards/src/cards/attack-reactions/scar-tissue.ts";
import { scarTissueBlue } from "../../../cards/src/cards/attack-reactions/scar-tissue.ts";
import { smokeOutRed } from "../../../cards/src/cards/defense-reactions/smoke-out.ts";
import { stainsOfTheRedbackRed } from "../../../cards/src/cards/attack-reactions/stains-of-the-redback.ts";
import { stainsOfTheRedbackYellow } from "../../../cards/src/cards/attack-reactions/stains-of-the-redback.ts";
import { stainsOfTheRedbackBlue } from "../../../cards/src/cards/attack-reactions/stains-of-the-redback.ts";
import { exposedBlue } from "../../../cards/src/cards/attack-reactions/exposed.ts";
import { marked } from "../../../cards/src/cards/conditions/marked.ts";

const LIFE = 20;

describe("Marked HNT attack cards", () => {
  it("CIN029 is the public hero condition and clears within an opposing hit event", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);

    // CIN029 is a CR 9.3 condition face, not an independently playable card.
    expect(typeBoxTokens(marked.base.typeBox)).toEqual([]);
    expect(
      game.getView({ role: "player", actorId: attacker.id }).players[defender.id]!.marked,
    ).toBe(true);

    attacker.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[defender.id]!.marked).toBe(false);
    expect(game.getView({ role: "spectator" }).players[defender.id]!.marked).toBe(false);
  });

  it("HNT237 Exposed marks the defending hero through its normal attack-reaction play", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [markThePreyRed, exposedBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    attacker.attackWith(markThePreyRed);
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    attacker.play(exposedBlue, { targetInstanceId: attackId });
    game.passBoth();
    expect(game.getState().players[defender.id]!.marked).toBe(true);
  });

  it.each([
    [stainsOfTheRedbackRed, 3],
    [stainsOfTheRedbackYellow, 2],
    [stainsOfTheRedbackBlue, 1],
  ] as const)(
    "%s is free against a marked defender and buffs the selected stealth attack",
    (reaction, bonus) => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [markThePreyRed, reaction], actionPoints: 1, deck: 6 },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      const attacker = game.as(bravo);
      const defender = game.as(dash);
      attacker.attackWith(markThePreyRed);
      defender.defendWith([]);
      attacker.pass();
      defender.pass();
      const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
      attacker.play(reaction, { targetInstanceId: attackId });
      game.passBoth();
      expect(game.combat()?.activeLink?.attackPower).toBe(3 + bonus);
    },
  );
  it.each([scarTissueRed, scarTissueYellow, scarTissueBlue])(
    "%s marks the opposing hero when its targeted dagger hits",
    (reaction) => {
      const game = FabTestEngine.start(
        { hero: bravo, weapon1: [harmonizedKodachi], hand: [reaction], resourcePoints: 1, deck: 6 },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      const attacker = game.as(bravo);
      const defender = game.as(dash);
      attacker.activate(harmonizedKodachi);
      game.passBoth();
      game.passBoth();
      defender.defendWith([]);
      attacker.pass();
      defender.pass();
      const daggerId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
      attacker.play(reaction, { targetInstanceId: daggerId });
      game.helpers.resolveRestOfCombat();
      expect(game.getState().players[defender.id]!.marked).toBe(true);
    },
  );

  it.each([[smokeOutRed, snatchRed]] as const)(
    "%s marks the attacking hero when played in its legal defense-reaction window",
    (reaction, attack) => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack], actionPoints: 1, deck: 6 },
        { hero: dash, hand: [reaction], deck: 6 },
        { autoPassPriority: false },
      );
      const attacker = game.as(bravo);
      const defender = game.as(dash);
      attacker.attackWith(attack);
      defender.defendWith([]);
      attacker.pass();
      defender.pass();
      attacker.pass();
      defender.play(reaction);
      game.helpers.resolveRestOfCombat();
      expect(game.getState().players[attacker.id]!.marked).toBe(true);
    },
  );

  it.each([
    [plungeTheProspectRed, 4],
    [plungeTheProspectYellow, 3],
    [plungeTheProspectBlue, 2],
  ] as const)("%s gets +1 power only against a marked hero", (card, markedDamage) => {
    const marked = FabTestEngine.start(
      { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    marked.as(bravo).attackWith(card);
    marked.helpers.resolveRestOfCombat();
    expect(marked.as(dash).life()).toBe(LIFE - markedDamage);
    expect(marked.getState().players[marked.as(dash).id]!.marked).toBe(false);

    const unmarked = FabTestEngine.start(
      { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    unmarked.as(bravo).attackWith(card);
    unmarked.helpers.resolveRestOfCombat();
    expect(unmarked.as(dash).life()).toBe(LIFE - (markedDamage - 1));
  });

  it.each([scuttleTheCanalRed, scuttleTheCanalYellow, scuttleTheCanalBlue])(
    "%s grants go again only when attacking a marked hero",
    (card) => {
      const marked = FabTestEngine.start(
        { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      marked.as(bravo).attackWith(card);
      marked.helpers.resolveRestOfCombat();
      expect(marked.as(bravo).actionPoints()).toBe(1);

      const unmarked = FabTestEngine.start(
        { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      unmarked.as(bravo).attackWith(card);
      unmarked.helpers.resolveRestOfCombat();
      expect(unmarked.as(bravo).actionPoints()).toBe(0);
    },
  );

  it.each([markOfTheBlackWidowRed, markOfTheBlackWidowYellow, markOfTheBlackWidowBlue])(
    "%s banishes a card from a marked hero it hits",
    (card) => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
        { hero: dash, hand: [snatchRed], marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      game.as(bravo).attackWith(card);
      game.helpers.resolveRestOfCombat();
      expect(game.as(dash).zone("banished")).toContain(snatchRed.canonicalId);
      expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
    },
  );

  it.each([markOfTheFunnelWebRed, markOfTheFunnelWebYellow, markOfTheFunnelWebBlue])(
    "%s banishes a card from a marked hero's arsenal when it hits",
    (card) => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
        { hero: dash, arsenal: [snatchRed], marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      game.as(bravo).attackWith(card);
      game.helpers.resolveRestOfCombat();
      expect(game.as(dash).zone("banished")).toContain(snatchRed.canonicalId);
      expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
    },
  );

  it.each([forTheDracaiRed, forTheEmperorRed, forTheRealmRed])(
    "%s creates Fealty when it attacks a marked hero, but not an unmarked one",
    (card) => {
      const marked = FabTestEngine.start(
        { hero: bravo, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      marked.as(bravo).attackWith(card);
      expect(marked.as(bravo).zone("arena")).toContain("token:fealty");

      const unmarked = FabTestEngine.start(
        { hero: bravo, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      unmarked.as(bravo).attackWith(card);
      expect(unmarked.as(bravo).zone("arena")).not.toContain("token:fealty");
    },
  );

  it.each([
    [publicBountyRed, 3],
    [publicBountyYellow, 2],
    [publicBountyBlue, 1],
  ] as const)("%s marks its target and buffs the next attack against it", (card, bonus) => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, snatchRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).play(card);
    game.helpers.resolveUntilIdle();
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(true);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(LIFE - 4 - bonus);
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
  });

  it.each([pointOfEngagementRed, pointOfEngagementYellow, pointOfEngagementBlue])(
    "%s grants its marked-hero attack bonus, but not against an unmarked hero",
    (card) => {
      const marked = FabTestEngine.start(
        { hero: bravo, hand: [card, snatchRed], actionPoints: 1, deck: 6 },
        { hero: dash, life: LIFE, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      marked.as(bravo).play(card);
      marked.helpers.resolveUntilIdle();
      marked.as(bravo).attackWith(snatchRed);
      marked.helpers.resolveRestOfCombat();
      expect(marked.as(dash).life()).toBe(LIFE - 5);

      const unmarked = FabTestEngine.start(
        { hero: bravo, hand: [card, snatchRed], actionPoints: 1, deck: 6 },
        { hero: dash, life: LIFE, deck: 6 },
        { autoPassPriority: false },
      );
      unmarked.as(bravo).play(card);
      unmarked.helpers.resolveUntilIdle();
      unmarked.as(bravo).attackWith(snatchRed);
      unmarked.helpers.resolveRestOfCombat();
      expect(unmarked.as(dash).life()).toBe(LIFE - 4);
    },
  );

  it.each([knifeThroughButterRed, knifeThroughButterYellow, knifeThroughButterBlue])(
    "%s gives a dagger attack go again only against a marked hero",
    (card) => {
      const marked = FabTestEngine.start(
        {
          hero: bravo,
          weapon1: [harmonizedKodachi],
          hand: [card],
          resourcePoints: 2,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      marked.as(bravo).play(card);
      marked.helpers.resolveUntilIdle();
      expect(marked.as(bravo).actionPoints()).toBe(1);
      expect(marked.getState().delayedTriggers).toHaveLength(1);
      marked.as(bravo).activate(harmonizedKodachi);
      marked.helpers.resolveRestOfCombat();
      expect(marked.as(bravo).actionPoints()).toBe(1);

      const unmarked = FabTestEngine.start(
        {
          hero: bravo,
          weapon1: [harmonizedKodachi],
          hand: [card],
          resourcePoints: 2,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      unmarked.as(bravo).play(card);
      unmarked.helpers.resolveUntilIdle();
      unmarked.as(bravo).activate(harmonizedKodachi);
      unmarked.helpers.resolveRestOfCombat();
      expect(unmarked.as(bravo).actionPoints()).toBe(0);
    },
  );

  it.each([
    markThePreyRed,
    markThePreyYellow,
    markThePreyBlue,
    trapAndReleaseRed,
    trapAndReleaseYellow,
    trapAndReleaseBlue,
    tagTheTargetRed,
    tagTheTargetYellow,
    tagTheTargetBlue,
    pursueToTheEdgeOfOblivionRed,
    pursueToThePitsOfDespairRed,
  ])("%s marks the hero it hits", (card) => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(card);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(true);
  });

  it.each([relentlessPursuitBlue, proclaimVengeanceRed])(
    "%s marks an opposing hero when played",
    (card) => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      game.as(bravo).play(card);
      game.helpers.resolveUntilIdle();
      expect(game.getState().players[game.as(dash).id]!.marked).toBe(true);
    },
  );

  it.each([
    reaperSCallRed,
    reaperSCallYellow,
    reaperSCallBlue,
    tipOffRed,
    tipOffYellow,
    tipOffBlue,
  ])("%s can be discarded at instant speed to mark an opposing hero", (card) => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).activate(card);
    game.helpers.resolveUntilIdle();
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(true);
    expect(game.as(bravo).zone("graveyard")).toContain(card.canonicalId);
  });

  it.each([
    swornVengeanceRed,
    swornVengeanceYellow,
    huntAKillerBlue,
    swornVengeanceBlue,
    huntAKillerRed,
    huntAKillerYellow,
  ])("%s grants a next dagger-hit mark", (card) => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [harmonizedKodachi],
        hand: [card],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).play(card);
    game.helpers.resolveUntilIdle();
    game.as(bravo).activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(true);
  });

  it("Outed (HNT235) gets its marked-defender power bonus", () => {
    const marked = FabTestEngine.start(
      { hero: bravo, hand: [outedRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    marked.as(bravo).attackWith(outedRed);
    marked.helpers.resolveRestOfCombat();
    expect(marked.as(dash).life()).toBe(LIFE - 4);

    const unmarked = FabTestEngine.start(
      { hero: bravo, hand: [outedRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    unmarked.as(bravo).attackWith(outedRed);
    unmarked.helpers.resolveRestOfCombat();
    expect(unmarked.as(dash).life()).toBe(LIFE - 3);
  });

  it("Outed (HNT235) cannot be played by a marked hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [outedRed], marked: true, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).attackWith(outedRed)).toThrow(/cannot|restrict|illegal/i);
  });

  it.each([whittleFromBoneRed, whittleFromBoneYellow, whittleFromBoneBlue])(
    "%s equips Graphene Chelicera when attacking a marked hero",
    (card) => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      game.as(bravo).attackWith(card);
      game.helpers.resolveRestOfCombat();
      expect(game.as(bravo).zone("arena")).toContain("token:graphene-chelicera");
    },
  );

  it.each([true, false])(
    "HNT053 Graphene Chelicera gets go again only when it attacks a %s marked hero",
    (marked) => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          arena: [grapheneChelicera],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, marked, deck: 6 },
        { autoPassPriority: false },
      );
      game.as(bravo).activate(grapheneChelicera);
      game.helpers.resolveRestOfCombat();

      expect(game.as(bravo).actionPoints()).toBe(marked ? 1 : 0);
    },
  );

  it("Hunt to the Ends of Rathe (CIN015) has its marked-Arakni power bonus", () => {
    const markedArakni = FabTestEngine.start(
      { hero: bravo, hand: [huntToTheEndsOfRatheRed], actionPoints: 1, deck: 6 },
      { hero: arakni, life: LIFE, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    markedArakni.as(bravo).attackWith(huntToTheEndsOfRatheRed);
    markedArakni.helpers.resolveRestOfCombat();
    expect(markedArakni.as(arakni).life()).toBe(LIFE - 4);
  });

  it.each([cindra, fang, cindraDracaiOfRetribution, fangDracaiOfBlades])(
    "%s creates Fealty when it hits a marked hero",
    (hero) => {
      const game = FabTestEngine.start(
        { hero, hand: [snatchRed], actionPoints: 1, deck: 6 },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      game.as(hero).attackWith(snatchRed);
      game.advanceToDecision(game.as(hero), "ordering");
      const decision = game.getState().decision;
      if (decision?.kind !== "ordering") throw new Error("Expected hit-trigger ordering");
      expect(new Set(decision.entries.map((entry) => entry.source?.canonicalId))).toEqual(
        new Set([hero.canonicalId, snatchRed.canonicalId]),
      );
      game.answerDecision(decision.actorId, {
        kind: "ordering",
        orderedIds: decision.entries.map((entry) => entry.id),
      });
      game.helpers.resolveRestOfCombat();
      expect(game.as(hero).zone("arena")).toContain("token:fealty");
      expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
    },
  );

  it("Mark of the Huntsman (HNT010) has its marked-target bonus and may destroy itself to mark on hit", () => {
    const markedTarget = FabTestEngine.start(
      { hero: bravo, weapon1: [markOfTheHuntsman], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    markedTarget.as(bravo).activate(markOfTheHuntsman);
    markedTarget.advanceToDecision(markedTarget.as(bravo), "boolean");
    markedTarget.as(bravo).chooseBoolean(false);
    markedTarget.helpers.resolveRestOfCombat();
    expect(markedTarget.as(dash).life()).toBe(LIFE - 2);

    const marksOnHit = FabTestEngine.start(
      { hero: bravo, weapon1: [markOfTheHuntsman], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    marksOnHit.as(bravo).activate(markOfTheHuntsman);
    marksOnHit.advanceToDecision(marksOnHit.as(bravo), "boolean");
    marksOnHit.as(bravo).chooseBoolean(true);
    marksOnHit.helpers.resolveRestOfCombat();
    expect(marksOnHit.as(bravo).zone("weapon1")).not.toContain(markOfTheHuntsman.canonicalId);
    expect(marksOnHit.getState().players[marksOnHit.as(dash).id]!.marked).toBe(true);
  });

  it.each([
    [toThePointRed, 5, 4],
    [toThePointYellow, 4, 3],
    [toThePointBlue, 3, 2],
  ] as const)(
    "%s has its larger dagger bonus against a marked defender",
    (card, markedPower, unmarkedPower) => {
      const run = (marked: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: bravo,
            weapon1: [harmonizedKodachi],
            hand: [card],
            resourcePoints: 1,
            actionPoints: 1,
            deck: 6,
          },
          { hero: dash, marked, deck: 6 },
          { autoPassPriority: false },
        );
        const A = game.as(bravo);
        const D = game.as(dash);
        A.activate(harmonizedKodachi);
        game.passBoth();
        game.passBoth();
        D.defendWith([]);
        A.pass();
        D.pass();
        const daggerId = game.getState().containers.zonesByPlayerId[A.id]!.combatChain[0]!;
        A.play(card, { targetInstanceId: daggerId });
        game.passBoth();
        return game.combat()?.activeLink?.attackPower;
      };
      expect(run(true)).toBe(markedPower);
      expect(run(false)).toBe(unmarkedPower);
    },
  );
});
