import { describe, expect, it } from "vitest";

import { alphaInstinctBlue } from "../../../cards/src/cards/actions/alpha-instinct.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { battlefrontBastionRed } from "../../../cards/src/cards/actions/battlefront-bastion.ts";
import { thisRoundSOnMeBlue } from "../../../cards/src/cards/actions/this-round-s-on-me.ts";
import { talismanOfTithesBlue } from "../../../cards/src/cards/actions/talisman-of-tithes.ts";
import { phoenixFlameRed } from "../../../cards/src/cards/actions/phoenix-flame.ts";
import { fai } from "../../../cards/src/cards/heroes/fai.ts";
import { brutalAssaultBlue } from "../../../cards/src/cards/actions/brutal-assault.ts";
import { goldenCompanyRed } from "../../../cards/src/cards/defense-reactions/golden-company.ts";
import { hala } from "../../../cards/src/cards/heroes/hala.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { crashDownTheGatesRed } from "../../../cards/src/cards/actions/crash-down-the-gates.ts";
import { groundbreakerCrix } from "../../../cards/src/cards/heroes/groundbreaker-crix.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import { enlightenedStrikeRed } from "../../../cards/src/cards/actions/enlightened-strike.ts";
import { dorintheaIronsong } from "../../../cards/src/cards/heroes/dorinthea-ironsong.ts";
import { durendal } from "../../../cards/src/cards/weapons/durendal.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { crossTheLineRed } from "../../../cards/src/cards/actions/cross-the-line.ts";
import { limpitHopALongYellow } from "../../../cards/src/cards/actions/limpit-hop-a-long.ts";
import { markOfUsheringBlue } from "../../../cards/src/cards/instants/mark-of-ushering.ts";
import { coaxACommotionRed } from "../../../cards/src/cards/actions/coax-a-commotion.ts";
import { luminaLanceYellow } from "../../../cards/src/cards/attack-reactions/lumina-lance.ts";
import { luminaLanceYellowI18n } from "../../../cards/src/cards/attack-reactions/lumina-lance.i18n.ts";
import { boltyn } from "../../../cards/src/cards/heroes/boltyn.ts";
import { coaxACommotionRedI18n } from "../../../cards/src/cards/actions/coax-a-commotion.i18n.ts";
import { localizeFleshAndBloodCard } from "../../../cards/src/localization.ts";
import { restlessMagisterRed } from "../../../cards/src/cards/actions/restless-magister.ts";
import { maliceDominaOfTheDead } from "../../../cards/src/cards/heroes/malice-domina-of-the-dead.ts";
import { zyggy } from "../../../cards/src/cards/heroes/zyggy.ts";
import { shatteringFlowtideBlue } from "../../../cards/src/cards/actions/shattering-flowtide.ts";
import { fingersOfFragmentation } from "../../../cards/src/cards/equipment/fingers-of-fragmentation.ts";
import { azalea } from "../../../cards/src/cards/heroes/azalea.ts";
import { sicEmShotBlue } from "../../../cards/src/cards/actions/sic-em-shot.ts";
import { sharpShooters } from "../../../cards/src/cards/equipment/sharp-shooters.ts";
import { danseMacabre } from "../../../cards/src/cards/equipment/danse-macabre.ts";
import { voxNecropolis } from "../../../cards/src/cards/weapons/vox-necropolis.ts";
import { FAB_MANUAL_HARNESS, FabTestEngine, fabToken } from "../testing/index.ts";

const localizedLuminaLance = localizeFleshAndBloodCard(luminaLanceYellow, luminaLanceYellowI18n);
const localizedCoaxACommotion = localizeFleshAndBloodCard(coaxACommotionRed, coaxACommotionRedI18n);

describe("player narrative acceptance", () => {
  it("explains the Malice, Vox Necropolis, and Danse Macabre combo in causal order", () => {
    const game = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        legs: [danseMacabre],
        weapon1: [voxNecropolis],
        graveyard: [restlessMagisterRed],
        resourcePoints: 4,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(maliceDominaOfTheDead);

    Malice.activate(maliceDominaOfTheDead);
    game.untilIdle();
    Malice.play(restlessMagisterRed, { from: "graveyard" });
    const triggerOrder = game.advanceToDecision(Malice, "ordering");
    const zombieTrigger = triggerOrder.entries.find(
      (entry) => entry.source?.canonicalId === restlessMagisterRed.canonicalId,
    );
    const danseTrigger = triggerOrder.entries.find(
      (entry) => entry.source?.canonicalId === danseMacabre.canonicalId,
    );
    if (!zombieTrigger || !danseTrigger) throw new Error("Expected Zombie and Danse triggers.");
    game.answerDecision(Malice.id, {
      kind: "ordering",
      orderedIds: [zombieTrigger.id, danseTrigger.id],
    });
    game.advanceUntil({ stopAt: "defend", optionals: "accept", ordering: "listed" });
    game.closeCombat({ ordering: "listed" });
    Malice.endTurn();
    game.untilIdle({ ordering: "listed" });

    const narrative = game.renderedPlayerNarrative(Malice.id);
    const expected = [
      "You played Restless Magister from graveyard.",
      "Your Restless Magister entered the arena tapped.",
      "Danse Macabre gives Restless Magister's first attack go again; when it resolves, You will gain 1 action point.",
      "You attacked Opponent with Restless Magister.",
      "Danse Macabre destroyed Restless Magister.",
      "Malice Domina Of The Dead banished a card from Your graveyard face down.",
      "Malice Domina Of The Dead created Corrupted Corpse for You.",
      "Malice Domina Of The Dead was untapped.",
    ];
    const positions = expected.map((line) => narrative.indexOf(line));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
    expect(narrative.some((line) => line.includes("blood debt"))).toBe(false);
  });

  it("names public targets across unrelated activated abilities", () => {
    const maliceGame = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = maliceGame.as(maliceDominaOfTheDead);

    Malice.activate(maliceDominaOfTheDead);
    maliceGame.untilIdle();

    expect(maliceGame.renderedPlayerNarrative(Malice.id)).toContain(
      "You activated Malice Domina Of The Dead, targeting Restless Magister.",
    );

    const combatGame = FabTestEngine.start(
      {
        hero: zyggy,
        arms: [fingersOfFragmentation],
        hand: [shatteringFlowtideBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = combatGame.as(zyggy);
    const Dash = combatGame.as(dash);

    Zyggy.playAttack(shatteringFlowtideBlue);
    Dash.defendWith(nimblismBlue);
    combatGame.toReaction("attacker");
    Zyggy.activate(fingersOfFragmentation);

    expect(combatGame.renderedPlayerNarrative(Zyggy.id)).toContain(
      "You activated Fingers Of Fragmentation, targeting Shattering Flowtide.",
    );
  });

  it("does not disclose a private activation target", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [sharpShooters],
        hand: [sicEmShotBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(sharpShooters);
    Azalea.target(sicEmShotBlue);

    expect(game.renderedPlayerNarrative(Azalea.id)).toContain("You activated Sharp Shooters.");
    expect(game.renderedPlayerNarrative(game.as(dash).id).join("\n")).not.toContain("Sic 'Em Shot");
  });

  it("names the Ally that an Aura binds to", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfUsheringBlue], arena: [limpitHopALongYellow], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(markOfUsheringBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();

    expect(game.renderedPlayerNarrative(Dash.id)).toEqual([
      "You played Mark Of Ushering.",
      "Mark Of Ushering bound to Limpit Hop A Long.",
    ]);
  });

  it("reports authored-card play, combat, and private draw consequences", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expect(game.renderedPlayerNarrative(Bravo.id)).toEqual([
      "Opponent played Snatch.",
      "Opponent attacked You with Snatch.",
      "Snatch hit You for 4.",
      "Opponent drew a card.",
    ]);
    expect(game.renderedPlayerNarrative(Dash.id)).toEqual([
      "You played Snatch.",
      "You attacked Opponent with Snatch.",
      "Snatch hit Opponent for 4.",
      "You drew: Nimblism.",
    ]);
  });

  it("retains the public card identity used to pay for a play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });

    expect(game.renderedPlayerNarrative(Dash.id)).toContain("You pitched Nimblism for 3.");
  });

  it("reports Lumina Lance's declared mode using its choice label", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, localizedLuminaLance],
        soul: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const soulId = Boltyn.cardsIn("soul", nimblismBlue)[0]!.instanceId;

    Boltyn.must.playAttack(crossTheLineRed);
    game.toReaction("attacker");
    Boltyn.must.playReaction(localizedLuminaLance, {
      targetInstanceId: soulId,
      modeIds: [`${localizedLuminaLance.canonicalId}:banishSoulAndChooseModes:boostLightAttack`],
    });

    const modeEntry = game
      .playerNarratives()
      .flatMap((log) => log.entries)
      .find((entry) => entry.publicMessage?.key === "flesh-and-blood.modal.modes-chosen");
    expect(game.renderedPlayerNarrative(Boltyn.id)).toContain(
      "You chose 1 mode for Lumina Lance: Boost Light Attack",
    );
    expect(modeEntry?.publicMessage?.values).toMatchObject({
      cardName: "Lumina Lance",
      modeCount: 1,
      modeText: "Boost Light Attack",
    });
    expect(modeEntry?.publicMessage?.cardRefs).toEqual([
      expect.objectContaining({ canonicalId: localizedLuminaLance.canonicalId }),
    ]);
  });

  it("reports a mode chosen for a triggered modal ability", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [localizedCoaxACommotion], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(localizedCoaxACommotion);
    for (let step = 0; step < 24; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        Dash.chooseOptions(
          `${localizedCoaxACommotion.canonicalId}:whenHitsChooseAnyNumberEachHeroCreatesQuicken:eachHeroDraws`,
        );
        break;
      }
      if (wait.kind === "defense-declaration") {
        game.as(bravo).defendWith();
        continue;
      }
      if (wait.kind === "priority") {
        game.pass(wait.playerId);
        continue;
      }
    }

    const triggeredModeEntry = game
      .playerNarratives()
      .flatMap((log) => log.entries)
      .find((entry) => entry.publicMessage?.key === "flesh-and-blood.modal.modes-chosen");
    expect(game.renderedPlayerNarrative(Dash.id)).toContain(
      "You chose 1 mode for Coax a Commotion: Each Hero Draws",
    );
    expect(triggeredModeEntry?.publicMessage?.values).toMatchObject({
      cardName: "Coax a Commotion",
      modeCount: 1,
      modeText: "Each Hero Draws",
    });
  });

  it("reports a replaced opposing draw as the consequence of the move", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfTithesBlue],
        hand: [thisRoundSOnMeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(thisRoundSOnMeBlue);
    game.untilIdle();

    expect(game.renderedPlayerNarrative(Dash.id)).toEqual([
      "You played This Round's On Me.",
      "You drew: Nimblism.",
      "Opponent did not draw a card because that draw was replaced.",
      "Talisman Of Tithes was destroyed.",
    ]);
    expect(game.renderedPlayerNarrative(Bravo.id)).toEqual([
      "Opponent played This Round's On Me.",
      "Opponent drew a card.",
      "You did not draw a card because that draw was replaced.",
      "Talisman Of Tithes was destroyed.",
    ]);
  });

  it("uses post-prevention damage and treats a zero-defense card as a block", () => {
    const prevented = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [battlefrontBastionRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = prevented.as(dash);
    const Fai = prevented.as(fai);

    Dash.attackWith(brutalAssaultBlue);
    prevented.advanceCombatTo("defend");
    Fai.defendWith(battlefrontBastionRed);
    prevented.helpers.resolveRestOfCombat();

    expect(prevented.renderedPlayerNarrative(Fai.id)).toContain("Brutal Assault hit You for 1.");

    const zeroDefense = FabTestEngine.start(
      { hero: fai, hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [alphaInstinctBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: fai },
    );
    const Attacker = zeroDefense.as(fai);
    const Defender = zeroDefense.as(rhinar);

    Attacker.attackWith(phoenixFlameRed);
    zeroDefense.advanceCombatTo("defend");
    Defender.defendWith(alphaInstinctBlue);
    zeroDefense.helpers.resolveRestOfCombat();

    expect(zeroDefense.renderedPlayerNarrative(Defender.id)).toContain(
      "Phoenix Flame was blocked by You.",
    );
  });

  it("does not attach the next turn start to the prior player's end-turn receipt", () => {
    const game = FabTestEngine.start(
      { hero: dash, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();

    expect(
      game
        .playerNarratives()
        .at(-1)
        ?.entries.some(
          ({ publicMessage }) => publicMessage?.key === "flesh-and-blood.turn.started",
        ),
    ).toBe(false);
  });

  it("keeps a created-token destruction that pays another card's cost", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: hala,
        hand: [goldenCompanyRed],
        arena: [fabToken("gold")],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Hala = game.as(hala);
    const goldInstanceId = Hala.findCardInZone("arena", fabToken("gold"));

    expect(game.getState().objects[goldInstanceId]?.objectKind).toBe("created-token");

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    Hala.must.playReaction(goldenCompanyRed, { modeIds: ["pay"] });
    game.helpers.resolveRestOfCombat();

    expect(game.renderedPlayerNarrative(Hala.id)).toContain("Gold was destroyed.");
    expect(game.renderedPlayerNarrative(Dash.id)).toContain("Gold was destroyed.");
    expect(
      game
        .moveLogs()
        .flatMap(({ public: messages }) => messages)
        .some(({ key }) => key === "flesh-and-blood.destroy"),
    ).toBe(true);
  });

  it("names a created token's self-destruction when it pays for its own effect", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [fabToken("gold")],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        intellect: 0,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const goldInstanceId = Dash.findCardInZone("arena", fabToken("gold"));

    expect(game.getState().objects[goldInstanceId]?.objectKind).toBe("created-token");

    Dash.must.activate(fabToken("gold"));
    game.untilIdle();

    expect(game.renderedPlayerNarrative(Dash.id)).toContain("You activated Gold.");
    expect(game.renderedPlayerNarrative(Dash.id)).toContain("Gold was destroyed.");
    expect(game.renderedPlayerNarrative(Dash.id)).toContain("You drew: Nimblism.");
    expect(game.renderedPlayerNarrative(Bravo.id)).toContain("Opponent activated Gold.");
    expect(game.renderedPlayerNarrative(Bravo.id)).toContain("Gold was destroyed.");
    expect(game.renderedPlayerNarrative(Bravo.id)).toContain("Opponent drew a card.");
  });

  it("keeps an independent reveal while compacting the same command's clash reveals", () => {
    const game = FabTestEngine.start(
      {
        hero: groundbreakerCrix,
        hand: [crashDownTheGatesRed],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [snatchRed],
        intellect: 0,
      },
      { hero: bravo, hand: [], deckTop: [nimblismBlue], intellect: 0 },
      FAB_MANUAL_HARNESS,
    );
    const Crix = game.as(groundbreakerCrix);
    const Bravo = game.as(bravo);

    Crix.playAttack(crashDownTheGatesRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    const crixNarrative = game.renderedPlayerNarrative(Crix.id);
    const bravoNarrative = game.renderedPlayerNarrative(Bravo.id);
    expect(crixNarrative.filter((line) => line === "Opponent revealed Nimblism.")).toHaveLength(1);
    expect(
      crixNarrative.some(
        (line) =>
          line.includes("You revealed Snatch") && line.includes("Opponent revealed Nimblism"),
      ),
    ).toBe(true);
    expect(bravoNarrative.filter((line) => line === "You revealed Nimblism.")).toHaveLength(1);
    expect(
      bravoNarrative.some(
        (line) =>
          line.includes("Opponent revealed Snatch") && line.includes("You revealed Nimblism"),
      ),
    ).toBe(true);
  });

  it("names Flurry, not the hero, when a blocked weapon still may attack twice", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [{ card: durendal, state: { powerCounterTotal: 2 } }],
        arena: [fabToken("flurry")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, enlightenedStrikeRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaIronsong);
    const Dash = game.as(dash);

    Dori.activate(durendal);
    game.advanceToDecision(Dori, "boolean");
    Dori.chooseBoolean(true);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(snatchRed, enlightenedStrikeRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    const narrative = game.renderedPlayerNarrative(Dori.id);
    expect(narrative).toContain("Flurry was destroyed.");
    expect(narrative).toContain("Flurry let Durendal attack twice this turn.");
    expect(narrative.some((line) => line.includes("Dorinthea Ironsong let Durendal"))).toBe(false);
    expect(narrative).toContain("Durendal was blocked by Opponent.");
  });

  it("names the hero when a weapon hit grants an additional attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [durendal],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaIronsong);

    Dori.activate(durendal);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    const narrative = game.renderedPlayerNarrative(Dori.id);
    expect(narrative).toContain(
      "Dorinthea Ironsong let Durendal attack an additional time this turn.",
    );
    expect(narrative.some((line) => line.includes("Flurry let Durendal"))).toBe(false);
    expect(narrative.some((line) => /Durendal hit /.test(line))).toBe(true);
  });

  it("names Quicken leaving and giving the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [fabToken("quicken")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    const narrative = game.renderedPlayerNarrative(Dash.id);
    expect(narrative).toContain("Quicken was destroyed.");
    expect(narrative).toContain("Quicken gave Snatch go again.");
  });

  it("names Courage leaving and giving the attack +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [fabToken("courage")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    const narrative = game.renderedPlayerNarrative(Dash.id);
    expect(narrative).toContain("Courage was destroyed.");
    expect(narrative).toContain("Courage gave Snatch +1 power.");
  });

  it("names Runechant leaving and the arcane damage it dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [fabToken("runechant")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    const narrative = game.renderedPlayerNarrative(Dash.id);
    expect(narrative).toContain("Runechant was destroyed.");
    expect(narrative).toContain("Opponent took 1 arcane damage from Runechant.");
  });

  it("names Agility leaving and arming go again on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [fabToken("agility")],
        hand: [snatchRed],
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.as(bravo).endTurn();
    game.passBoth();

    const narrative = game.renderedPlayerNarrative(Dash.id);
    expect(narrative).toContain("Agility was destroyed.");
    expect(narrative).toContain("Agility gives the next attack go again.");
  });
});
