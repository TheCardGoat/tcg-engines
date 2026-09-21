/**
 * Exhaustive vocabulary audit: every registered log key renders through the
 * `en` catalog for a complete, typed sample payload. The fixture below is a
 * `satisfies`-complete map, so adding a registry key fails compilation here
 * until a validated sample exists — no key can ship unrenderable.
 *
 * Dual-viewer semantics (owner labels vs public reader redaction) are covered
 * by `dual-viewer-audit.test.ts` and the simulator projection tests.
 */
import { describe, expect, it } from "vitest";
import {
  FAB_LOG_KEYS,
  FAB_LOG_KEY_CATEGORIES,
  renderFabLogTemplate,
  type FabLogCategory,
  type FabLogKey,
  type FabLogValuesFor,
} from "./index.ts";

const VALID_CATEGORIES: readonly FabLogCategory[] = [
  "action",
  "combat",
  "ability",
  "rules",
  "system",
];

/**
 * Complete typed sample payload per key. Values are chosen to be non-empty,
 * pairwise distinct within a key, and free of brace characters so the
 * interpolation assertions below stay unambiguous.
 */
const SAMPLE_VALUES = {
  "flesh-and-blood.command.begin-play": { actorId: "alpha" },
  "flesh-and-blood.command.set-optional-trigger-automation": {
    actorId: "alpha",
    cardName: "Dawnblade",
  },
  "flesh-and-blood.command.set-automation-preferences": { actorId: "alpha" },
  "flesh-and-blood.command.play-and-skip-hold-enabled": {
    actorId: "alpha",
    cardName: "Snatch",
  },
  "flesh-and-blood.command.play-and-skip-hold-disabled": {
    actorId: "alpha",
    cardName: "Snatch",
  },
  "flesh-and-blood.command.opponent-trigger-auto-yield-enabled": {
    actorId: "alpha",
    cardName: "Fyendal's Spring Tunic",
  },
  "flesh-and-blood.command.opponent-trigger-auto-yield-disabled": {
    actorId: "alpha",
    cardName: "Fyendal's Spring Tunic",
  },
  "flesh-and-blood.command.instant-auto-yield-enabled": {
    actorId: "alpha",
    cardName: "Cosmic Duality",
  },
  "flesh-and-blood.command.instant-auto-yield-disabled": {
    actorId: "alpha",
    cardName: "Cosmic Duality",
  },
  "flesh-and-blood.command.arm-priority-hold": { actorId: "alpha" },
  "flesh-and-blood.command.answer-decision": { actorId: "alpha" },
  "flesh-and-blood.command.activate": { actorId: "alpha" },
  "flesh-and-blood.command.defend": { actorId: "alpha" },
  "flesh-and-blood.command.pass": { actorId: "alpha" },
  "flesh-and-blood.command.end-turn": { actorId: "alpha" },
  "flesh-and-blood.command.concede": { actorId: "alpha" },
  "flesh-and-blood.trigger-automation.auto-pass": {
    actorId: "alpha",
    cardName: "Dawnblade",
  },
  "flesh-and-blood.priority-automation.auto-pass": { actorId: "alpha" },
  "flesh-and-blood.decision-automation.auto-order": {
    actorId: "alpha",
    decisionKind: "trigger-order",
  },
  "flesh-and-blood.decision-automation.auto-target": { actorId: "alpha" },

  "flesh-and-blood.play": { actorId: "alpha", cardName: "Snatch" },
  "flesh-and-blood.play.from-zone": {
    actorId: "alpha",
    cardName: "Restless Magister",
    from: "graveyard",
  },
  "flesh-and-blood.bind": { auraName: "Mark of Ushering", hostName: "Limpit Hop-a-Long" },
  "flesh-and-blood.modal.modes-chosen": {
    actorId: "alpha",
    cardName: "Art of War",
    modeCount: 2,
    modePlural: "s",
    modeText: "Attack action cards gain +1 power; The next attack gains go again",
  },
  "flesh-and-blood.activate": { actorId: "alpha", cardName: "Dawnblade" },
  "flesh-and-blood.activate.targeting": {
    actorId: "alpha",
    cardName: "Malice, Domina of the Dead",
    targetName: "Restless Magister",
  },
  "flesh-and-blood.pitch": { playerId: "alpha", cardName: "Heart Of Fyendal", resources: 3 },
  "flesh-and-blood.defend": { actorId: "alpha", cardName: "Sink Below" },

  "flesh-and-blood.draw": { playerId: "alpha" },
  "flesh-and-blood.draw.cards": { playerId: "alpha", count: 2 },
  "flesh-and-blood.draw.private": { playerId: "alpha", cardNames: "Nimblism, Snatch" },
  "flesh-and-blood.draw.replaced": { playerId: "alpha" },
  "flesh-and-blood.draw.replaced.cards": { playerId: "alpha", count: 3 },

  "flesh-and-blood.search": { playerId: "alpha" },
  "flesh-and-blood.search.found": { playerId: "alpha", cardName: "Nimblism" },
  "flesh-and-blood.look": { playerId: "alpha" },
  "flesh-and-blood.look.private": { playerId: "alpha", cardName: "Spinning Hook" },
  "flesh-and-blood.opt": { playerId: "alpha" },
  "flesh-and-blood.opt.cards": {
    playerId: "alpha",
    topCount: 2,
    topPlural: "s",
    bottomCount: 2,
    bottomPlural: "s",
  },
  "flesh-and-blood.opt.private": {
    playerId: "alpha",
    topNames: "Nimblism",
    bottomNames: "Snatch",
  },
  "flesh-and-blood.reveal": { playerId: "alpha", cardName: "Boltyn" },

  "flesh-and-blood.discard": { playerId: "alpha", cardName: "Snatch" },
  "flesh-and-blood.discard.random": { playerId: "alpha", cardName: "Snatch" },
  "flesh-and-blood.banish": { playerId: "alpha", cardName: "Veil Of Steel" },
  "flesh-and-blood.banish.hidden": { playerId: "alpha" },
  "flesh-and-blood.banish.hidden.by-source": {
    playerId: "alpha",
    sourceName: "Send Packing",
    from: "arsenal",
  },
  "flesh-and-blood.banish.hidden-identity": { playerId: "alpha" },
  "flesh-and-blood.banish.hidden-identity.by-source": {
    playerId: "alpha",
    sourceName: "Viserai Between Worlds",
    from: "deck",
  },
  "flesh-and-blood.deck-bottom": { playerId: "alpha", from: "hand" },
  "flesh-and-blood.deck-bottom.private": {
    playerId: "alpha",
    cardName: "Snatch",
    from: "hand",
  },
  "flesh-and-blood.destroy": { cardName: "Romping Chair" },
  "flesh-and-blood.destroy.by-source": {
    sourceName: "Danse Macabre",
    cardName: "Restless Magister",
  },
  "flesh-and-blood.dies": { cardName: "Trench Of Sunken Fortunes" },
  "flesh-and-blood.put-into-graveyard": { cardName: "Romping Chair" },
  "flesh-and-blood.enter-arena": { playerId: "alpha", cardName: "Cindra" },
  "flesh-and-blood.enter-arena.tapped": { playerId: "alpha", cardName: "Cindra" },
  "flesh-and-blood.leave-arena": { playerId: "alpha", cardName: "Cindra" },
  "flesh-and-blood.move-zone": {
    playerId: "alpha",
    cardName: "Snatch",
    from: "hand",
    to: "graveyard",
  },
  "flesh-and-blood.move-zone.hidden": { playerId: "alpha", from: "hand", to: "deck" },
  "flesh-and-blood.shuffle-zone": { playerId: "alpha", zone: "deck" },
  "flesh-and-blood.turn-face-up": { playerId: "alpha", cardName: "Veil Of Steel" },
  "flesh-and-blood.turn-face-down": { playerId: "alpha", cardName: "Veil Of Steel" },
  "flesh-and-blood.equip": { playerId: "alpha", cardName: "Aegis Of The Iron Heart" },
  "flesh-and-blood.create": { playerId: "alpha", cardName: "Ash" },
  "flesh-and-blood.create.by-source": {
    sourceName: "Malice, Domina of the Dead",
    playerId: "alpha",
    cardName: "Corrupted Corpse",
  },
  "flesh-and-blood.become": { cardName: "Ember", previousName: "Ash" },
  "flesh-and-blood.gain-name": {
    cardName: "Become the Bottle",
    gainedName: "Crouching Tiger",
    sourceName: "Become the Bottle",
  },
  "flesh-and-blood.lose-names": { cardName: "Become the Bottle", sourceName: "Amnesia" },
  "flesh-and-blood.name-gain-restricted": { sourceName: "Amnesia", playerId: "beta" },
  "flesh-and-blood.transform": { cardName: "Ash", intoName: "Ember" },
  "flesh-and-blood.boost": { actorId: "alpha", cardName: "Hyper Driver" },
  "flesh-and-blood.boost.banish": {
    actorId: "alpha",
    cardName: "Hyper Driver",
    banishedName: "Thrust",
  },
  "flesh-and-blood.charge": {
    actorId: "alpha",
    cardName: "Teklo Core",
    chargedName: "Thrust",
  },
  "flesh-and-blood.fuse": {
    actorId: "alpha",
    cardName: "Snap Shot",
    revealedNames: "Thrust, Unmovable",
  },
  "flesh-and-blood.fragment": { actorId: "alpha", cardName: "Fractal Replication" },
  "flesh-and-blood.usurp": {
    actorId: "alpha",
    cardName: "Demonbound Gloomblade",
    usurpedName: "Runechant",
  },
  "flesh-and-blood.crank": { actorId: "alpha", cardName: "Teklo Core" },
  "flesh-and-blood.transcend": { actorId: "alpha", cardName: "Enigma Engine" },
  "flesh-and-blood.complete-contract": { actorId: "alpha", cardName: "Contract Death" },
  "flesh-and-blood.beat-chest": {
    actorId: "alpha",
    chestOwner: "alpha",
    cardNames: "Thrust, Unmovable",
  },
  "flesh-and-blood.awaken": { playerId: "alpha", cardName: "Ouvia" },
  "flesh-and-blood.change-active-face": { cardName: "Nourishing Emptiness", faceId: "earth" },

  "flesh-and-blood.attack": {
    actorId: "alpha",
    cardName: "Extinguish The Flames",
    targetName: "beta",
  },
  "flesh-and-blood.attack.by-source": {
    sourceName: "Vox Necropolis",
    cardName: "Restless Magister",
    targetName: "beta",
  },
  "flesh-and-blood.combat.hit": {
    cardName: "Extinguish The Flames",
    targetName: "beta",
    damage: 4,
  },
  "flesh-and-blood.combat.blocked": {
    cardName: "Extinguish The Flames",
    targetName: "beta",
  },
  "flesh-and-blood.combat.missed": {
    cardName: "Extinguish The Flames",
    targetName: "beta",
  },
  "flesh-and-blood.combat.miss": {
    cardName: "Extinguish The Flames",
    targetName: "beta",
    result: "blocked",
  },
  "flesh-and-blood.combat.chain-close": {},
  "flesh-and-blood.damage": { playerId: "beta", amount: 4 },
  "flesh-and-blood.damage.typed": { playerId: "beta", amount: 4, damageType: "arcane" },
  "flesh-and-blood.damage.with-source": {
    playerId: "beta",
    amount: 4,
    sourceName: "Extinguish The Flames",
  },
  "flesh-and-blood.damage.with-source.typed": {
    playerId: "beta",
    amount: 4,
    damageType: "arcane",
    sourceName: "Extinguish The Flames",
  },
  "flesh-and-blood.prevent": { playerId: "beta", amount: 4, sourceName: "Arcane Lantern" },

  "flesh-and-blood.wager": { actorId: "alpha", cardName: "Wager" },
  "flesh-and-blood.wager.win": { playerId: "alpha", cardName: "Wager" },
  "flesh-and-blood.wager.loss": { playerId: "beta", cardName: "Wager" },
  "flesh-and-blood.clash.outcome": {
    firstPlayerId: "alpha",
    firstCardName: "Nimblism",
    firstPowerLabel: "no power",
    secondPlayerId: "beta",
    secondCardName: "Spinning Hook",
    secondPowerLabel: "6 power",
  },
  "flesh-and-blood.clash.win": {
    winnerId: "alpha",
    winnerPowerLabel: "6 power",
    loserPowerLabel: "4 power",
  },
  "flesh-and-blood.clash.tie": {
    firstPowerLabel: "4 power",
    secondPowerLabel: "4 power",
  },
  "flesh-and-blood.roll": { playerId: "alpha", sides: 20, result: 17 },

  "flesh-and-blood.cost-life": { playerId: "alpha", life: 5 },
  "flesh-and-blood.cost-chi": { playerId: "alpha", chi: 4 },
  "flesh-and-blood.assets.granted": {
    playerId: "alpha",
    resources: 2,
    plural: "s",
    cardName: "Blossom Of Spring",
  },
  "flesh-and-blood.assets.granted.action-points": {
    playerId: "alpha",
    actionPoints: 2,
    plural: "s",
    cardName: "Diamond Amulet",
  },
  "flesh-and-blood.assets.granted.chi": {
    playerId: "alpha",
    chi: 2,
    cardName: "Arc Ramp",
  },
  "flesh-and-blood.assets.granted.amp": {
    playerId: "alpha",
    amp: 1,
    cardName: "Staff of Verdant Shoots",
  },
  "flesh-and-blood.gain-life": { playerId: "alpha", amount: 4 },
  "flesh-and-blood.lose-life": { playerId: "beta", amount: 4 },
  "flesh-and-blood.lose-life.blood-debt": {
    playerId: "alpha",
    amount: 1,
    sourceName: "Corrupted Corpse",
  },
  "flesh-and-blood.go-again": { cardName: "Snatch" },
  "flesh-and-blood.may-attack": {
    sourceName: "Flurry",
    cardName: "Durendal",
    timesLabel: "twice",
  },
  "flesh-and-blood.crowd-cheers": { playerId: "alpha" },
  "flesh-and-blood.crowd-boos": { playerId: "beta" },
  "flesh-and-blood.protect": { playerId: "alpha", protectedPlayerId: "beta" },
  "flesh-and-blood.counter-added": { cardName: "Cindra", counter: "steam", amount: 3, plural: "s" },
  "flesh-and-blood.counter-removed": {
    cardName: "Cindra",
    counter: "steam",
    amount: 2,
    plural: "s",
  },
  "flesh-and-blood.numeric-counter-added": {
    cardName: "Cindra",
    counter: "+1 power",
    count: 5,
    plural: "s",
  },
  "flesh-and-blood.numeric-counter-removed": {
    cardName: "Cindra",
    counter: "+1 power",
    count: 2,
    plural: "s",
  },
  "flesh-and-blood.gain-keyword": { cardName: "Snatch", keyword: "go again" },
  "flesh-and-blood.gave-keyword": {
    sourceName: "Quicken",
    cardName: "Snatch",
    keyword: "go again",
  },
  "flesh-and-blood.gave-power": { sourceName: "Courage", cardName: "Snatch", amount: "+1" },
  "flesh-and-blood.name-card": { playerId: "alpha", cardName: "Snatch" },
  "flesh-and-blood.sharpen": { playerId: "alpha", cardName: "Katana", count: 2, plural: "s" },
  "flesh-and-blood.modify-power": { cardName: "Romping Chair", from: 4, to: 9 },
  "flesh-and-blood.next-attack-power-bonus": { sourceName: "Song Of Sinew", amount: 4 },
  "flesh-and-blood.next-attack-keyword": { sourceName: "Agility", keyword: "go again" },
  "flesh-and-blood.next-attack-of-keyword": {
    sourceName: "Danse Macabre",
    cardName: "Restless Quartermaster",
    keyword: "go again",
  },
  "flesh-and-blood.next-attack-of-go-again": {
    sourceName: "Danse Macabre",
    cardName: "Restless Magister",
    playerId: "alpha",
  },
  "flesh-and-blood.set-tapped": { cardName: "Romping Chair", state: "tapped" },
  "flesh-and-blood.set-tapped.by-source": {
    sourceName: "Vox Necropolis",
    cardName: "Restless Magister",
  },

  "flesh-and-blood.ability.triggered": { cardName: "Dawnblade" },
  "flesh-and-blood.ability.layer": { cardName: "Dawnblade" },

  "flesh-and-blood.marked": { sourceName: "Obsidian Fire Vein", playerId: "beta" },

  "flesh-and-blood.turn.started": { turnNumber: 7 },
  "flesh-and-blood.game.ended": { playerId: "beta", reason: "no-life" },
  "flesh-and-blood.decision.awaiting": { actorId: "alpha" },
  "flesh-and-blood.decision.chosen": { actorId: "alpha", choice: "Snatch, Wounding Blow" },
  "flesh-and-blood.decision.private": { label: "Choose a card to banish" },
  "flesh-and-blood.deck-top": { playerId: "alpha", cardName: "Wounding Blow", from: "graveyard" },
  "flesh-and-blood.phase.start": { turnPlayerId: "alpha", phase: "action" },

  "flesh-and-blood.decision-automation.auto-decline": { actorId: "alpha" },
} as const satisfies { readonly [TKey in FabLogKey]: FabLogValuesFor<TKey> };

describe("FabLog vocabulary rendering", () => {
  it("keeps the fixture complete and the registry non-trivial", () => {
    // The `satisfies` map is compile-time complete; the runtime mirror guards
    // against a fixture entry being silently dropped by tooling.
    expect(Object.keys(SAMPLE_VALUES).sort()).toEqual([...FAB_LOG_KEYS].sort());
    expect(FAB_LOG_KEYS.length).toBeGreaterThanOrEqual(95);
  });

  it("renders every key with a non-empty, fully interpolated line", () => {
    const problems: string[] = [];
    for (const key of FAB_LOG_KEYS) {
      const values = SAMPLE_VALUES[key];
      const rendered = renderFabLogTemplate(key, values);

      if (rendered.trim().length === 0) {
        problems.push(`${key}: rendered empty`);
        continue;
      }
      if (rendered.includes("{") || rendered.includes("}")) {
        problems.push(`${key}: leftover placeholder braces in "${rendered}"`);
      }
      for (const [name, value] of Object.entries(values)) {
        if (String(value).length === 0) {
          problems.push(`${key}: sample value "${name}" is empty`);
          continue;
        }
        if (!rendered.includes(String(value))) {
          problems.push(`${key}: value "${name}" (${String(value)}) missing from "${rendered}"`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("classifies every key into a known category", () => {
    const problems: string[] = [];
    for (const key of FAB_LOG_KEYS) {
      const category = FAB_LOG_KEY_CATEGORIES[key];
      if (!VALID_CATEGORIES.includes(category)) {
        problems.push(`${key}: missing or invalid category ${JSON.stringify(category)}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
