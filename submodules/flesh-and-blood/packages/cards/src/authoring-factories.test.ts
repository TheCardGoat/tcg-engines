import { describe, expect, it } from "vitest";
import {
  createToken,
  discardRandom,
  lookThen,
  nextAttackAction,
  plusPower,
  PITCH_TO_COLOR,
} from "@tcg/flesh-and-blood-types";
import { definePitchFamily, modalAbility } from "./authoring/pitch-family.ts";
import { semanticTriggeredModalResolution } from "./authoring/card.ts";
import { fabPitchFamilies as reunionPitchFamilies } from "./generated/card-identities/actions/10-000-year-reunion.generated.ts";
import { fabPitchFamilies as serenityPitchFamilies } from "./generated/card-identities/instants/blessing-of-serenity.generated.ts";
import { nimblismBlue, nimblismRed, nimblismYellow } from "./cards/actions/nimblism.ts";
import { snatchBlue, snatchRed, snatchYellow } from "./cards/actions/snatch.ts";
import {
  bloodTributeBlue,
  bloodTributeRed,
  bloodTributeYellow,
} from "./cards/instants/blood-tribute.ts";
import {
  primevalBellowBlue,
  primevalBellowRed,
  primevalBellowYellow,
} from "./cards/actions/primeval-bellow.ts";
import { pummelBlue, pummelRed, pummelYellow } from "./cards/attack-reactions/pummel.ts";
import { incisionBlue, incisionRed, incisionYellow } from "./cards/attack-reactions/incision.ts";
import {
  scarTissueBlue,
  scarTissueRed,
  scarTissueYellow,
} from "./cards/attack-reactions/scar-tissue.ts";
import {
  takeAStabBlue,
  takeAStabRed,
  takeAStabYellow,
} from "./cards/attack-reactions/take-a-stab.ts";
import {
  toThePointBlue,
  toThePointRed,
  toThePointYellow,
} from "./cards/attack-reactions/to-the-point.ts";
import {
  shortAndSharpBlue,
  shortAndSharpRed,
  shortAndSharpYellow,
} from "./cards/attack-reactions/short-and-sharp.ts";
import {
  razorReflexBlue,
  razorReflexRed,
  razorReflexYellow,
} from "./cards/attack-reactions/razor-reflex.ts";
import { dragDownBlue, dragDownRed, dragDownYellow } from "./cards/defense-reactions/drag-down.ts";
import {
  evasiveLeapBlue,
  evasiveLeapRed,
  evasiveLeapYellow,
} from "./cards/defense-reactions/evasive-leap.ts";
import {
  fateForeseenBlue,
  fateForeseenRed,
  fateForeseenYellow,
} from "./cards/defense-reactions/fate-foreseen.ts";
import {
  riseAboveBlue,
  riseAboveRed,
  riseAboveYellow,
} from "./cards/defense-reactions/rise-above.ts";
import {
  unmovableBlue,
  unmovableRed,
  unmovableYellow,
} from "./cards/defense-reactions/unmovable.ts";
import {
  crowdControlBlue,
  crowdControlRed,
  crowdControlYellow,
} from "./cards/blocks/crowd-control.ts";
import {
  crashAndBashBlue,
  crashAndBashRed,
  crashAndBashYellow,
} from "./cards/blocks/crash-and-bash.ts";
import {
  shieldBashBlue,
  shieldBashRed,
  shieldBashYellow,
} from "./cards/defense-reactions/shield-bash.ts";
import {
  shieldWallBlue,
  shieldWallRed,
  shieldWallYellow,
} from "./cards/defense-reactions/shield-wall.ts";
import {
  staunchResponseBlue,
  staunchResponseRed,
  staunchResponseYellow,
} from "./cards/defense-reactions/staunch-response.ts";
import {
  takeCoverBlue,
  takeCoverRed,
  takeCoverYellow,
} from "./cards/defense-reactions/take-cover.ts";
import { chaseTheTailRed } from "./cards/actions/chase-the-tail.ts";
import { deepBlue } from "./cards/equipment/deep-blue.ts";

describe("authoring factories (shipped constructors)", () => {
  it("strips a color suffix only from a pitched card identity", () => {
    expect(deepBlue.base.names).toEqual(["Deep Blue"]);
    expect(nimblismBlue.base.names).toEqual(["Nimblism"]);
  });

  it("definePitchFamily builds Nimblism RGB from generated identity and one ability shape", () => {
    const trio = [
      { card: nimblismRed, pitch: 1, color: "red", amount: 3 },
      { card: nimblismYellow, pitch: 2, color: "yellow", amount: 2 },
      { card: nimblismBlue, pitch: 3, color: "blue", amount: 1 },
    ] as const;
    for (const row of trio) {
      expect(row.card.base.numeric.pitch).toBe(row.pitch);
      expect(row.card.base.color).toBe(row.color);
      expect(PITCH_TO_COLOR[String(row.pitch) as keyof typeof PITCH_TO_COLOR].toLowerCase()).toBe(
        row.color,
      );
      expect(row.card.base.abilities).toHaveLength(1);
      const ability = row.card.base.abilities![0]!;
      expect(ability.kind).toBe("resolution");
      expect(ability.id).toBe(`${row.card.canonicalId}:buffNextLowCostAttack`);
      expect(ability.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: row.amount,
        appliesTo: {
          next: {
            typeBox: { types: ["Action"], subtypes: ["Attack"] },
            cost: { op: "lte", value: 1 },
          },
        },
      });
      expect(ability.effect).not.toMatchObject({ target: { selector: "this-attack" } });
    }
  });

  it("lookThen requires outputBinding and stamps it on the look step", () => {
    const effect = lookThen({
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["deck"],
        position: "top",
        count: 1,
      },
      outputBinding: "it",
      then: { type: "draw", count: 1, player: "controller" },
    });
    expect(effect).toEqual({
      type: "sequence",
      steps: [
        {
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
        { type: "draw", count: 1, player: "controller" },
      ],
    });
  });

  it("definePitchFamily builds Snatch RGB from one on-hit draw ability", () => {
    const trio = [
      { card: snatchRed, pitch: 1, color: "red", power: 4 },
      { card: snatchYellow, pitch: 2, color: "yellow", power: 3 },
      { card: snatchBlue, pitch: 3, color: "blue", power: 2 },
    ] as const;
    for (const row of trio) {
      expect(row.card.base.numeric.pitch).toBe(row.pitch);
      expect(row.card.base.color).toBe(row.color);
      expect(row.card.base.numeric.power).toBe(row.power);
      expect(row.card.base.abilities).toHaveLength(1);
      const ability = row.card.base.abilities![0]!;
      expect(ability.kind).toBe("static");
      expect(ability.id).toBe(`${row.card.canonicalId}:drawOnHit`);
      expect(ability.text).toBe("");
      expect(ability).toMatchObject({
        staticKind: "triggered",
        trigger: { kind: "event", event: { name: "hit" } },
        resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
      });
    }
  });

  it("definePitchFamily preserves pitch-sensitive keyword metadata", () => {
    expect(bloodTributeRed.base.keywords).toEqual([{ name: "opt", value: 3 }]);
    expect(bloodTributeYellow.base.keywords).toEqual([{ name: "opt", value: 2 }]);
    expect(bloodTributeBlue.base.keywords).toEqual([{ name: "opt", value: 1 }]);
  });

  it("definePitchFamily builds representative modal and pitch-scaled families", () => {
    const pitchRows = [
      { card: primevalBellowRed, pitch: 1, color: "red", amount: 5 },
      { card: primevalBellowYellow, pitch: 2, color: "yellow", amount: 4 },
      { card: primevalBellowBlue, pitch: 3, color: "blue", amount: 3 },
    ] as const;
    for (const row of pitchRows) {
      expect(row.card.base.numeric.pitch).toBe(row.pitch);
      expect(row.card.base.color).toBe(row.color);
      expect(row.card.base.abilities).toHaveLength(2);
      expect(row.card.base.keywords).toEqual([{ name: "go-again" }]);
      expect(row.card.base.abilities?.[1]).toMatchObject({
        id: `${row.card.canonicalId}:nextBruteAttack`,
        effect: { amount: row.amount },
      });
    }

    const modalRows = [
      { card: razorReflexRed, amount: 3, secondMode: "attackAction" },
      { card: razorReflexYellow, amount: 2, secondMode: "attackAction" },
      { card: razorReflexBlue, amount: 1, secondMode: "attackAction" },
      { card: pummelRed, amount: 4, secondMode: "hitHero" },
      { card: pummelYellow, amount: 3, secondMode: "hitHero" },
      { card: pummelBlue, amount: 2, secondMode: "hitHero" },
    ] as const;
    for (const row of modalRows) {
      const ability = row.card.base.abilities?.[0];
      expect(ability?.kind).toBe("modal");
      if (ability?.kind !== "modal") throw new Error("expected keyed family modal ability");
      expect(ability.modes.map((mode) => mode.id)).toEqual([
        `${row.card.canonicalId}:chooseMode:weapon`,
        `${row.card.canonicalId}:chooseMode:${row.secondMode}`,
      ]);
      expect(ability.modes[0]?.effect).toMatchObject({ amount: row.amount });
    }
  });

  it("definePitchFamily propagates hybrid supertype sets", () => {
    const warriorAssassin = [
      incisionRed,
      incisionYellow,
      incisionBlue,
      scarTissueRed,
      scarTissueYellow,
      scarTissueBlue,
      takeAStabRed,
      takeAStabYellow,
      takeAStabBlue,
      toThePointRed,
      toThePointYellow,
      toThePointBlue,
    ] as const;
    for (const card of warriorAssassin) {
      expect(card.base.typeBox.supertypeSets).toEqual([["Assassin"], ["Warrior"]]);
    }
    const shortSharp = [shortAndSharpRed, shortAndSharpYellow, shortAndSharpBlue] as const;
    for (const card of shortSharp) {
      expect(card.base.typeBox.supertypeSets).toEqual([["Assassin"], ["Ninja"]]);
    }
  });

  it("definePitchFamily builds every printed reaction and block family member", () => {
    const families = [
      [dragDownRed, dragDownYellow, dragDownBlue],
      [evasiveLeapRed, evasiveLeapYellow, evasiveLeapBlue],
      [fateForeseenRed, fateForeseenYellow, fateForeseenBlue],
      [riseAboveRed, riseAboveYellow, riseAboveBlue],
      [unmovableRed, unmovableYellow, unmovableBlue],
      [crowdControlRed, crowdControlYellow, crowdControlBlue],
      [crashAndBashRed, crashAndBashYellow, crashAndBashBlue],
      [shieldBashRed, shieldBashYellow, shieldBashBlue],
      [shieldWallRed, shieldWallYellow, shieldWallBlue],
      [staunchResponseRed, staunchResponseYellow, staunchResponseBlue],
      [takeCoverRed, takeCoverYellow, takeCoverBlue],
    ] as const;
    for (const [red, yellow, blue] of families) {
      expect(red.base.numeric.pitch).toBe(1);
      expect(yellow.base.numeric.pitch).toBe(2);
      expect(blue.base.numeric.pitch).toBe(3);
      expect(red.base.color).toBe("red");
      expect(yellow.base.color).toBe("yellow");
      expect(blue.base.color).toBe("blue");
    }
  });

  it("definePitchFamily builds only the printed colors for a partial family", () => {
    const family = definePitchFamily(reunionPitchFamilies["10-000-year-reunion"], {});

    expect(Object.keys(family.cards)).toEqual(["red"]);
    expect(family.cards.red.base.color).toBe("red");
    expect(family.cards.red.base.numeric.pitch).toBe(1);
  });

  it("definePitchFamily derives modal identity from authored semantic keys", () => {
    const family = definePitchFamily(serenityPitchFamilies["blessing-of-serenity"], {
      abilities: () => ({
        chooseEffect: modalAbility({
          kind: "modal",
          modal: { choose: 1 },
          modes: {
            drawCard: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        }),
      }),
    });

    const ability = family.cards.red.base.abilities?.[0];
    expect(ability).toMatchObject({
      kind: "modal",
      id: `${family.cards.red.canonicalId}:chooseEffect`,
      modes: [
        {
          id: `${family.cards.red.canonicalId}:chooseEffect:drawCard`,
          text: "",
          effect: { type: "draw", count: 1, player: "controller" },
        },
      ],
    });
  });

  it("definePitchFamily derives triggered modal identity from authored semantic keys", () => {
    const family = definePitchFamily(serenityPitchFamilies["blessing-of-serenity"], {
      abilities: () => ({
        chooseOnAttack: {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: semanticTriggeredModalResolution({
            kind: "modal",
            choose: 1,
            modes: {
              drawCard: { type: "draw", count: 1, player: "controller" },
            },
          }),
        },
      }),
    });

    const ability = family.cards.red.base.abilities?.[0];
    expect(ability).toMatchObject({
      kind: "static",
      id: `${family.cards.red.canonicalId}:chooseOnAttack`,
      resolution: {
        kind: "modal",
        modes: [
          {
            id: `${family.cards.red.canonicalId}:chooseOnAttack:drawCard`,
            text: "",
            effect: { type: "draw", count: 1, player: "controller" },
          },
        ],
      },
    });
  });

  it("createToken and discardRandom emit the existing IR leaves", () => {
    expect(createToken("might", 1)).toEqual({
      type: "create-token",
      token: "might",
      controller: "controller",
      count: 1,
    });
    expect(discardRandom(2)).toEqual({
      type: "discard",
      random: true,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "attack-target",
        zones: ["hand"],
        count: 2,
      },
    });
  });

  it("Chase the Tail expands Combo last-attack at load without restating the CR sentence", () => {
    const ability = chaseTheTailRed.base.abilities![0]!;
    expect(ability.label?.name).toBe("combo");
    expect(ability.kind).toBe("static");
    expect(ability).toMatchObject({
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        state: { type: "last-attack-this-combat-chain", names: ["Crouching Tiger"] },
      },
    });
  });

  it("nextAttackAction wraps plusPower without a dummy this-attack target", () => {
    const effect = nextAttackAction({
      filter: { cost: { op: "lte", value: 1 } },
      grant: plusPower(3),
    });
    expect(effect.type).toBe("modify-numeric");
    expect(effect).toMatchObject({
      appliesTo: {
        next: {
          typeBox: { types: ["Action"], subtypes: ["Attack"] },
          cost: { op: "lte", value: 1 },
        },
      },
    });
    expect("target" in effect ? effect.target : undefined).toBeUndefined();
  });
});
