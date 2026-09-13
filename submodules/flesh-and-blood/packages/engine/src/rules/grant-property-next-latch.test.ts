/**
 * First-class grant-property / attack-proxy / appliesTo.next latch.
 *
 * Citations: CR 1.4.3, 1.8.10, 8.3.5b, 8.3.9, 8.3.27; Errata Bulletin #9.
 * Catalog cards only. Public FabTestEngine verbs — no private runtime APIs.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  buildFabRulesView,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "../testing/index.ts";

import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { fai } from "../../../cards/src/cards/heroes/fai.ts";
import { vynnset } from "../../../cards/src/cards/heroes/vynnset.ts";
import { dorinthea } from "../../../cards/src/cards/heroes/dorinthea.ts";
import { dorintheaIronsong } from "../../../cards/src/cards/heroes/dorinthea-ironsong.ts";
import { warriorSValorRed } from "../../../cards/src/cards/actions/warrior-s-valor.ts";
import { teklovossen } from "../../../cards/src/cards/heroes/teklovossen.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { buckwildRed } from "../../../cards/src/cards/actions/buckwild.ts";
import { colorsOfAriaRed } from "../../../cards/src/cards/actions/colors-of-aria.ts";
import { brandWithCinderclawRed } from "../../../cards/src/cards/actions/brand-with-cinderclaw.ts";
import { dragonPowerBlue } from "../../../cards/src/cards/actions/dragon-power.ts";
import { lavaVeinLoyaltyRed } from "../../../cards/src/cards/actions/lava-vein-loyalty.ts";
import { putridStirringsRed } from "../../../cards/src/cards/actions/putrid-stirrings.ts";
import { envelopInDarknessRed } from "../../../cards/src/cards/actions/envelop-in-darkness.ts";
import { riftSkitterRed } from "../../../cards/src/cards/actions/rift-skitter.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import { dauntlessRed } from "../../../cards/src/cards/actions/dauntless.ts";
import { dawnblade } from "../../../cards/src/cards/weapons/dawnblade.ts";
import { unmovableRed } from "../../../cards/src/cards/defense-reactions/unmovable.ts";
import { sinkBelowRed } from "../../../cards/src/cards/defense-reactions/sink-below.ts";
import { tekloTrebuchet2000Blue } from "../../../cards/src/cards/actions/teklo-trebuchet-2000.ts";
import { zeroToSixtyRed } from "../../../cards/src/cards/actions/zero-to-sixty.ts";
import { grindingGearsBlue } from "../../../cards/src/cards/actions/grinding-gears.ts";
import { brutalAssaultBlue } from "../../../cards/src/cards/actions/brutal-assault.ts";
import { prism } from "../../../cards/src/cards/heroes/prism.ts";
import { phantasmifyRed } from "../../../cards/src/cards/actions/phantasmify.ts";

function attackSupertypes(game: FabTestEngine): readonly string[] {
  const sourceId = game.getState().combat?.activeLink?.activeAttack?.sourceObjectId;
  if (!sourceId) return [];
  const record = game.getState().objects[sourceId];
  if (!record) return [];
  return (
    buildFabRulesView(game.getState()).object({
      instanceId: sourceId,
      incarnation: record.incarnation,
    })?.current.typeBox.supertypes ?? []
  );
}

function openDauntlessWeaponAttack(
  defenderResources: number,
  defenderHand: readonly (typeof unmovableRed)[],
) {
  const game = FabTestEngine.start(
    {
      hero: dorinthea,
      hand: [dauntlessRed],
      weapon1: [dawnblade],
      resourcePoints: 2,
      actionPoints: 1,
      deck: 6,
    },
    {
      hero: dash,
      hand: defenderHand,
      resourcePoints: defenderResources,
      life: 20,
      deck: 6,
    },
    FAB_MANUAL_HARNESS,
  );
  const Dori = game.as(dorinthea);
  const Dash = game.as(dash);
  Dori.play(dauntlessRed);
  game.helpers.resolveUntilIdle({ optionalBoolean: false });
  Dori.activate(dawnblade);
  game.passBoth();
  game.advanceCombatTo("reaction");
  if (Dori.hasPriority()) Dori.pass();
  return { game, Dori, Dash };
}

describe("grant-property / appliesTo.next latch", () => {
  it("1. Buckwild (SUP143): 6+{p} in pitch grants go again onto the attack (CR 8.3.5b)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [buckwildRed],
        pitch: [colorsOfAriaRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(buckwildRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Rhinar, buckwildRed).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("2. Brand with Cinderclaw (FAI020): next attack this combat chain is Draconic (CR 1.8.10)", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    expect(attackSupertypes(game)).toContain("Draconic");
    game.advanceCombatTo("resolution");
    Fai.attackWith(brutalAssaultBlue);

    expect(attackSupertypes(game)).toContain("Draconic");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("2a. Brand with Cinderclaw: an unused next-attack grant expires when its combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.helpers.resolveRestOfCombat();
    Fai.attackWith(brutalAssaultBlue);

    expect(attackSupertypes(game)).not.toContain("Draconic");
  });

  it("2b. Dragon Power observes Brand's Draconic grant and gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, dragonPowerBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(dragonPowerBlue);

    expect(attackSupertypes(game)).toContain("Draconic");
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("2c. Lava Vein Loyalty sees 2 Draconic links after a Brand-granted follow-up", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, dragonPowerBlue, lavaVeinLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(dragonPowerBlue);
    game.advanceCombatTo("resolution");
    Fai.attackWith(lavaVeinLoyaltyRed);

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("3. Putrid Stirrings: next rune-gated attack action this turn gets +5{p} (CR 8.3.27)", () => {
    const runechant = fabToken("runechant");
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsRed, riftSkitterRed],
        arena: [runechant, runechant, runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(putridStirringsRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Vynnset.attackWith(riftSkitterRed, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(9);
  });

  it("3b. Envelop in Darkness: next rune-gated attack action gets +3{p}", () => {
    const runechant = fabToken("runechant");
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [envelopInDarknessRed],
        banished: [riftSkitterRed],
        arena: [runechant, runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Vynnset.attackWith(riftSkitterRed, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("3c. a non-rune-gated attack does not receive the Putrid Stirrings buff", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsRed],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(putridStirringsRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Vynnset.attackWith(snatchRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("4. Dauntless: printed-cost Defense Reaction is illegal; printed+1 pays", () => {
    const short = openDauntlessWeaponAttack(3, [unmovableRed]);
    const shortId = short.Dash.findCardInZone("hand", unmovableRed);
    expect(
      short.Dash.expectFailure({
        move: "begin-play",
        payload: { instanceId: shortId },
      }).errorCode,
    ).toBe("insufficient_resources");

    const paid = openDauntlessWeaponAttack(4, [unmovableRed]);
    paid.Dash.play(unmovableRed);
    gamePassUntilDefending(paid.game, paid.Dash, unmovableRed);
    expectFabCard(paid.Dash, unmovableRed).toBeIn("combatChain");
  });

  it("4b. Dauntless extra cost is consumed by the first Defense Reaction", () => {
    const { game, Dash } = openDauntlessWeaponAttack(4, [unmovableRed, sinkBelowRed]);
    Dash.play(unmovableRed);
    gamePassUntilDefending(game, Dash, unmovableRed);
    expectFabCard(Dash, sinkBelowRed).toBeIn("hand");
    const priority = game.getPriorityPlayerId();
    if (priority && priority !== Dash.id) game.pass(priority);
    Dash.play(sinkBelowRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // Printed 0-cost Sink Below is legal once the first Defense Reaction paid
    // Dauntless's extra {r}. Combat may close after the second DR resolves.
    expectFabCard(Dash, sinkBelowRed).toBeIn("graveyard");
  });

  it("5. Teklo Trebuchet: next boosted attack this combat chain gets +2{p} (CR 8.3.9)", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tekloTrebuchet2000Blue, zeroToSixtyRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(tekloTrebuchet2000Blue, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(zeroToSixtyRed, { boost: true });

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("Valor +3 latches the first Dawnblade proxy and does not leak onto the extra attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [dawnblade],
        hand: [warriorSValorRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaIronsong);

    Dori.must.play(warriorSValorRed);
    game.helpers.resolveUntilIdle();
    Dori.must.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    Dori.must.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("Phantasmify nested appliesTo.next grants latch the first AAC and do not leak (CR 6.2.4)", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmifyRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(phantasmifyRed);
    game.untilIdle();
    Prism.playAttack(snatchRed);
    expectCombat(game)
      .toHaveAttackPower(9)
      .toHaveKeyword("phantasm")
      .toHaveAttackSupertype("Illusionist");
    game.closeCombat({ optionals: "decline" });

    Prism.playAttack(snatchRed);
    expectCombat(game)
      .toHaveAttackPower(4)
      .notToHaveKeyword("phantasm")
      .notToHaveAttackSupertype("Illusionist");
  });
});

function gamePassUntilDefending(
  game: FabTestEngine,
  defender: ReturnType<FabTestEngine["as"]>,
  card: typeof unmovableRed,
): void {
  const instanceId = defender.findCardInZone("stack", card);
  for (let safety = 0; safety < 16; safety += 1) {
    const onLink = Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {})
      .flat()
      .some((id) => id === instanceId);
    if (onLink) return;
    const decision = game.getState().decision;
    if (decision) {
      throw new Error(`Unexpected ${decision.kind} decision while resolving Unmovable.`);
    }
    const priority = game.getPriorityPlayerId();
    if (!priority) break;
    game.pass(priority);
  }
  throw new Error("Unmovable did not resolve onto the active chain link.");
}
