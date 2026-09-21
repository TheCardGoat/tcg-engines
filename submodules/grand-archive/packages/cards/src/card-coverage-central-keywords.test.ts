import { trivariateDream } from "./cards/DTR/weapons/trivariate-dream.ts";
import { aethercloakSentinel } from "./cards/DTR/allies/aethercloak-sentinel.ts";
import { evercurrentRaider } from "./cards/DTR/allies/evercurrent-raider.ts";
import { aquiferSeneschal } from "./cards/DTR/allies/aquifer-seneschal.ts";
import { spectralDiffusion } from "./cards/DTR/actions/spectral-diffusion.ts";
import { dianaAetherDilettante } from "./cards/DTR/champions/diana-aether-dilettante.ts";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  centralKeywordContracts,
  centralKeywordEvidence,
  centralKeywordSuite,
  specializedCentralKeywordContracts,
  validateCentralKeywordEvidence,
} from "../scripts/card-coverage/central-keywords.ts";
import { caretakerDrone } from "./cards/ALC/allies/caretaker-drone.ts";
import { carterSyntheticReaper } from "./cards/ALC/allies/carter-synthetic-reaper.ts";
import { battlefieldSpotter } from "./cards/ALC/allies/battlefield-spotter.ts";
import { temporalSpectrometer } from "./cards/ALC/items/temporal-spectrometer.ts";
import { combatTraining } from "./cards/AMB/actions/combat-training.ts";
import { hemorrhagingRend } from "./cards/AMB/attacks/hemorrhaging-rend.ts";
import { jinZealousMaverick } from "./cards/AMB/champions/jin-zealous-maverick.ts";
import { imperialAssassin } from "./cards/AMB/allies/imperial-assassin.ts";
import { royalBear } from "./cards/AMB/allies/royal-bear.ts";
import { yunzhouCavalry } from "./cards/AMB/allies/yunzhou-cavalry.ts";
import { phantomVeil } from "./cards/AMB/items/phantom-veil.ts";
import { grandArchiveTestFace } from "./testing/class-bonus-test-champion.ts";
import { channelTheWind } from "./cards/DOA/actions/channel-the-wind.ts";
import { grayWolf } from "./cards/DOA/allies/gray-wolf.ts";
import { raiArchmage } from "./cards/DOA/champions/rai-archmage.ts";
import { carnwennanShroudedEdge } from "./cards/DOA/weapons/carnwennan-shrouded-edge.ts";
import { shroudInMist } from "./cards/DOA/actions/shroud-in-mist.ts";
import { elyanLustreLoyalty } from "./cards/EVP/allies/elyan-lustre-loyalty.ts";
import { overlordMkIii } from "./cards/EVP/allies/overlord-mk-iii.ts";
import { perseRelentlessRaptor } from "./cards/EVP/allies/perse-relentless-raptor.ts";
import { redHareUnrivaledStallion } from "./cards/EVP/allies/red-hare-unrivaled-stallion.ts";

describe("central keyword coverage accountability", () => {
  it("covers only standalone Aetherwing with its enabled engine contract", () => {
    const ability = grandArchiveTestFace(trivariateDream).abilities[0]!;
    if (ability.kind !== "static" || ability.staticKind !== "intrinsic")
      throw new Error("Expected the standalone intrinsic Aetherwing paragraph");
    expect(centralKeywordEvidence(ability)).toEqual({
      keyword: "aetherwing",
      testPath: centralKeywordSuite,
      testName: centralKeywordContracts.aetherwing,
    });
    expect(
      centralKeywordEvidence({
        ...ability,
        restrictions: [
          {
            kind: "static",
            name: "class-bonus",
            condition: { kind: "champion-matches-source", characteristic: "class" },
          },
        ],
      }),
    ).toBeNull();
    expect(centralKeywordEvidence(grandArchiveTestFace(trivariateDream).abilities[1]!)).toBeNull();
  });

  it("keeps DTR grouped, parameterized, restricted, granted and inherited keywords card-specific", () => {
    for (const [card, index] of [
      [aethercloakSentinel, 0],
      [evercurrentRaider, 1],
      [aquiferSeneschal, 1],
      [spectralDiffusion, 1],
      [dianaAetherDilettante, 1],
    ] as const) {
      expect(centralKeywordEvidence(grandArchiveTestFace(card).abilities[index]!)).toBeNull();
    }
    expect(
      centralKeywordEvidence(grandArchiveTestFace(evercurrentRaider).abilities[0]!),
    ).toMatchObject({ keyword: "floating-memory" });
  });
  it("keeps DOA parameterized, restricted, granted, and modified keyword behavior card-specific", () => {
    for (const card of [
      channelTheWind,
      grayWolf,
      raiArchmage,
      carnwennanShroudedEdge,
      shroudInMist,
    ]) {
      for (const ability of grandArchiveTestFace(card).abilities) {
        expect(centralKeywordEvidence(ability)).toBeNull();
      }
    }
  });
  it("recognizes a real unconditional keyword but not conditional or composite effects", () => {
    expect(
      centralKeywordEvidence(grandArchiveTestFace(caretakerDrone).abilities[0]!),
    ).toMatchObject({ keyword: "intercept" });
    expect(
      centralKeywordEvidence(grandArchiveTestFace(temporalSpectrometer).abilities[0]!),
    ).toEqual({
      keyword: "divine-relic",
      ...specializedCentralKeywordContracts["divine-relic"],
    });
    expect(centralKeywordEvidence(grandArchiveTestFace(caretakerDrone).abilities[1]!)).toBeNull();
    for (const card of [carterSyntheticReaper, battlefieldSpotter])
      for (const ability of grandArchiveTestFace(card).abilities)
        expect(centralKeywordEvidence(ability)).toBeNull();
  });

  it("does not infer coverage for values, zones, restrictions, or unsupported names", () => {
    const base = { id: "fixture-a1", kind: "static", staticKind: "intrinsic", text: "" } as const;
    expect(centralKeywordEvidence({ ...base, keyword: { name: "ranged", value: 2 } })).toBeNull();
    expect(centralKeywordEvidence({ ...base, keyword: { name: "distant" } })).toBeNull();
    expect(
      centralKeywordEvidence({
        ...base,
        keyword: { name: "stealth" },
        functionalZones: ["graveyard"],
      }),
    ).toBeNull();
    expect(
      centralKeywordEvidence({ ...base, keyword: { name: "stealth" }, restrictions: [] }),
    ).toBeNull();
  });

  it("does not centrally cover parameterized, restricted, or typed-target keywords from AMB", () => {
    expect(centralKeywordEvidence(grandArchiveTestFace(royalBear).abilities[0]!)).toBeNull();
    expect(centralKeywordEvidence(grandArchiveTestFace(phantomVeil).abilities[0]!)).toBeNull();
    expect(centralKeywordEvidence(grandArchiveTestFace(combatTraining).abilities[1]!)).toBeNull();
    expect(centralKeywordEvidence(grandArchiveTestFace(yunzhouCavalry).abilities[0]!)).toBeNull();
    expect(centralKeywordEvidence(grandArchiveTestFace(imperialAssassin).abilities[0]!)).toBeNull();
    expect(centralKeywordEvidence(grandArchiveTestFace(hemorrhagingRend).abilities[0]!)).toBeNull();
    expect(
      centralKeywordEvidence(grandArchiveTestFace(jinZealousMaverick).abilities[0]!),
    ).toBeNull();
  });

  it("keeps EVP parameterized, restricted, and grouped keywords card-specific", () => {
    for (const card of [
      elyanLustreLoyalty,
      overlordMkIii,
      perseRelentlessRaptor,
      redHareUnrivaledStallion,
    ]) {
      for (const ability of grandArchiveTestFace(card).abilities) {
        expect(centralKeywordEvidence(ability)).toBeNull();
      }
    }
  });

  it("requires the actual enabled engine tests for every registered contract", () => {
    const genericSource = readFileSync(
      new URL("../../engine/src/rules/abilities/keyword-effects.test.ts", import.meta.url),
      "utf8",
    );
    const specializedSource = readFileSync(
      new URL("../../engine/src/kernel/engine.test.ts", import.meta.url),
      "utf8",
    );
    const sources = {
      [centralKeywordSuite]: genericSource,
      [specializedCentralKeywordContracts["divine-relic"].testPath]: specializedSource,
    };
    expect(() => validateCentralKeywordEvidence(sources)).not.toThrow();
    const declaration = `it(${JSON.stringify(centralKeywordContracts.intercept)},`;
    expect(() =>
      validateCentralKeywordEvidence({
        ...sources,
        [centralKeywordSuite]: genericSource.replace(declaration, 'it("renamed",'),
      }),
    ).toThrow("Missing enabled");
    for (const modifier of ["skip", "only", "todo", "skipIf", "runIf"]) {
      expect(() =>
        validateCentralKeywordEvidence({
          ...sources,
          [centralKeywordSuite]: genericSource.replace(declaration, `it.${modifier}("disabled",`),
        }),
      ).toThrow("disabled or exclusive");
    }
    expect(() => validateCentralKeywordEvidence({})).toThrow();
  });
});
