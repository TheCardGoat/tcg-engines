import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { heraldOfJudgmentYellow } from "../actions/herald-of-judgment.ts";
import { prismaticShieldBlue } from "../instants/prismatic-shield.ts";
import { glisteningSteelbladeYellow } from "../actions/glistening-steelblade.ts";
import { theLibrarian } from "./the-librarian.ts";

/**
 * Mentor behavior acceptance test — The Librarian (PSM002).
 */

const steelbladeDeck = [
  glisteningSteelbladeYellow,
  glisteningSteelbladeYellow,
  glisteningSteelbladeYellow,
  glisteningSteelbladeYellow,
  glisteningSteelbladeYellow,
  glisteningSteelbladeYellow,
] as const;

describe("The Librarian (PSM002) AAA", () => {
  it("happy: mentor has Illusionist/Mentor types and d3", () => {
    expect(theLibrarian.base.typeBox.supertypes).toContain("Illusionist");
    expect(theLibrarian.base.typeBox.types).toContain("Mentor");
    expect(theLibrarian.base.numeric.defense).toBe(3);
  });

  it("boundary: declining the start-of-turn face-up leaves the mentor face-down in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arsenal: [{ card: theLibrarian }],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const mentorId = Prism.findCardInZone("arsenal", theLibrarian);
    game.setObjectFaceDown(mentorId, true);

    Prism.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Prism, theLibrarian).toBeIn("arsenal");
    expectFabCard(Prism, theLibrarian).toBeFaceDown();
  });

  it("timing: creating a Spectral Shield draws and puts a lesson counter on The Librarian", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arsenal: [{ card: theLibrarian }],
        hand: [prismaticShieldBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [...steelbladeDeck],
      },
      { hero: dash, deck: 6 },
    );
    const Prism = game.as(prism);
    const mentorId = Prism.findCardInZone("arsenal", theLibrarian);
    game.setObjectFaceDown(mentorId, false);

    Prism.play(prismaticShieldBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expect(Prism.zone("arena")).toContain("token:spectral-shield");
    expect(Prism.zone("hand")).toContain(glisteningSteelbladeYellow.canonicalId);
    expectFabCard(Prism, theLibrarian).toHaveCounters(1, "lesson");
  });

  it("timing: third Spectral Shield this game still does not banish The Librarian and search a specialization (trigger is once per turn)", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arsenal: [{ card: theLibrarian }],
        hand: [prismaticShieldBlue, prismaticShieldBlue, prismaticShieldBlue],
        resourcePoints: 9,
        actionPoints: 1,
        deck: [heraldOfJudgmentYellow, ...steelbladeDeck],
      },
      { hero: dash, deck: 6 },
    );
    const Prism = game.as(prism);
    game.setObjectFaceDown(Prism.findCardInZone("arsenal", theLibrarian), false);

    for (let created = 0; created < 3; created += 1) {
      Prism.play(prismaticShieldBlue);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    }

    expect(Prism.zone("arena").filter((card) => card === "token:spectral-shield")).toHaveLength(3);
    expect(
      Prism.zone("hand").filter((card) => card === glisteningSteelbladeYellow.canonicalId),
    ).toHaveLength(1);
    expectFabCard(Prism, theLibrarian).toBeIn("arsenal");
    expectFabCard(Prism, theLibrarian).toHaveCounters(1, "lesson");
    expect(Prism.zone("deck")).toContain(heraldOfJudgmentYellow.canonicalId);
    expect(Prism.zone("banished")).toEqual([]);
  });

  it("happy: the third lesson counter banishes The Librarian and arsenals a specialization", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arsenal: [{ card: theLibrarian, state: { faceDown: false, namedCounters: { lesson: 2 } } }],
        hand: [prismaticShieldBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [heraldOfJudgmentYellow, ...steelbladeDeck],
      },
      { hero: dash, deck: 6 },
    );
    const Prism = game.as(prism);

    expectFabCard(Prism, theLibrarian).toHaveCounters(2, "lesson");
    Prism.play(prismaticShieldBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expect(Prism.zone("arena")).toContain("token:spectral-shield");
    expectFabCard(Prism, theLibrarian).toBeBanished();
    expectFabCard(Prism, heraldOfJudgmentYellow).toBeIn("arsenal");
    expect(Prism.zone("deck")).not.toContain(heraldOfJudgmentYellow.canonicalId);
  });
});
