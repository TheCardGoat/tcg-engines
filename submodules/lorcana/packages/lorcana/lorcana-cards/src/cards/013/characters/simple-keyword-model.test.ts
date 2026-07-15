import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dashParrDodgeballDynamo } from "./114-dash-parr-dodgeball-dynamo";
import { kingLouieKingOfSwing } from "./121-king-louie-king-of-swing";
import { dashParrVioletParrSuperSiblings } from "./133-dash-parr-violet-parr-super-siblings";
import { launchpadSkyPatrol } from "./143-launchpad-sky-patrol";
import { hadesMeticulousSchemer } from "./156-hades-meticulous-schemer";
import { kronkMeatHutCook } from "./191-kronk-meat-hut-cook";
import { sheriffOfNottinghamVineSlayer } from "./181-sheriff-of-nottingham-vine-slayer";
import { violetParrForceFieldPractice } from "./183-violet-parr-force-field-practice";
import { drHamstervielEvilObserver } from "./184-dr-hamsterviel-evil-observer";
import { madamMimHummingbird } from "./086-madam-mim-hummingbird";

const keywordCards = [
  {
    card: dashParrDodgeballDynamo,
    keyword: "Evasive",
    name: "Dash Parr - Dodgeball Dynamo",
    value: null,
  },
  {
    card: kingLouieKingOfSwing,
    keyword: "Singer",
    name: "King Louie - King of Swing",
    value: 6,
  },
  {
    card: launchpadSkyPatrol,
    keyword: "Alert",
    name: "Launchpad - Sky Patrol",
    value: null,
  },
  {
    card: dashParrVioletParrSuperSiblings,
    keyword: "Evasive",
    name: "Dash Parr & Violet Parr - Super Siblings",
    value: null,
  },
  {
    card: dashParrVioletParrSuperSiblings,
    keyword: "Resist",
    name: "Dash Parr & Violet Parr - Super Siblings",
    value: 1,
  },
  {
    card: madamMimHummingbird,
    keyword: "Evasive",
    name: "Madam Mim - Hummingbird",
    value: null,
  },
  {
    card: hadesMeticulousSchemer,
    keyword: "Ward",
    name: "Hades - Meticulous Schemer",
    value: null,
  },
  {
    card: sheriffOfNottinghamVineSlayer,
    keyword: "Challenger",
    name: "Sheriff of Nottingham - Vine Slayer",
    value: 3,
  },
  {
    card: violetParrForceFieldPractice,
    keyword: "Resist",
    name: "Violet Parr - Force Field Practice",
    value: 1,
  },
  {
    card: drHamstervielEvilObserver,
    keyword: "Alert",
    name: "Dr. Hamsterviel - Evil Observer",
    value: null,
  },
  {
    card: kronkMeatHutCook,
    keyword: "Resist",
    name: "Kronk - Meat Hut Cook",
    value: 1,
  },
] as const;

describe("Attack of the Vine! simple keyword characters", () => {
  it.each([...keywordCards])(
    "$name has $keyword",
    ({ card, keyword, value }: (typeof keywordCards)[number]) => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [card],
      });

      expect(testEngine.asPlayerOne().hasKeyword(card, keyword)).toBe(true);
      if (value !== null) {
        expect(testEngine.asPlayerOne().getKeywordValue(card, keyword)).toBe(value);
      }
    },
  );
});
