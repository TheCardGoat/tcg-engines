import type { FixtureName } from "./index.ts";
import {
  RELEASE_REVIEW_ENTRIES,
  reviewFixtureId,
  reviewInstructions,
  type ReviewTiming,
} from "./release-card-review-labs.ts";

export type GundamFixtureGroup =
  | "Setup"
  | "Main Phase"
  | "ST10 · Generation Pulse"
  | "ST10 · Release review"
  | "GD05 · Release review"
  | "Battle"
  | "Effects and prompts"
  | "End Phase"
  | "Automation";

export type GundamFixtureStartPoint =
  | "before-game"
  | "main-phase"
  | "battle"
  | "end-phase"
  | "automation";

export type IndexedGundamFixtureName = Exclude<FixtureName, "vs-ai-match">;

export interface GundamFixtureScenario {
  readonly id: IndexedGundamFixtureName;
  readonly group: GundamFixtureGroup;
  readonly label: string;
  readonly description: string;
  readonly instructions: string;
  readonly startPoint: GundamFixtureStartPoint;
  readonly cards?: readonly string[];
}

const RELEASE_REVIEW_SCENARIOS: readonly GundamFixtureScenario[] = RELEASE_REVIEW_ENTRIES.flatMap(
  ({ card, timings }) =>
    timings.map((timing) => ({
      id: reviewFixtureId(card.cardNumber, timing) as IndexedGundamFixtureName,
      group: `${card.cardNumber.startsWith("ST10-") ? "ST10" : "GD05"} · Release review` as
        | "ST10 · Release review"
        | "GD05 · Release review",
      label: `${card.cardNumber} · ${card.name} · ${reviewTimingLabel(timing)}`,
      description:
        "Single-card release review route using the card's real definition in its required visible zone with legal Resources, hosts, targets, and battle state.",
      instructions: reviewInstructions(card, timing),
      startPoint: reviewStartPoint(timing),
      cards: [card.cardNumber],
    })),
);

function reviewTimingLabel(timing: ReviewTiming): string {
  return timing.replaceAll("-", " ");
}

function reviewStartPoint(timing: ReviewTiming): GundamFixtureStartPoint {
  return timing === "burst" || timing === "action" || timing === "block" ? "battle" : "main-phase";
}

/**
 * Player-facing catalog for deterministic Gundam simulator states.
 *
 * Factories remain lazy in `index.ts`; this registry is deliberately data-only
 * so the fixture index can render without loading every engine scenario.
 */
export const GUNDAM_FIXTURE_SCENARIOS: readonly GundamFixtureScenario[] = [
  {
    id: "setup-default",
    group: "Setup",
    label: "Opening hand and mulligan",
    description:
      "Before the Game with both opening hands dealt and the viewer deciding whether to redraw.",
    instructions:
      "Keep or redraw the opening hand, then confirm the opponent receives its decision.",
    startPoint: "before-game",
  },
  {
    id: "setup-default-opponent-keeps",
    group: "Setup",
    label: "Opponent keeps",
    description:
      "Before the Game after the opponent automatically keeps, leaving the viewer's mulligan decision active.",
    instructions: "Keep the hand and verify Shields, the EX Base, and Player Two's EX Resource.",
    startPoint: "before-game",
  },
  {
    id: "mulligan-animation-demo",
    group: "Setup",
    label: "Mulligan redraw animation",
    description:
      "A deterministic five-card opening hand waiting at Player One's real alter-hand decision.",
    instructions:
      "Choose Redraw Hand and verify all changed cards return to the Deck Area before five replacements enter Hand.",
    startPoint: "before-game",
  },
  {
    id: "main-phase-demo",
    group: "Main Phase",
    label: "Main Phase board",
    description:
      "A populated Main Phase board for checking hand, Resource, Unit, and opposing board interactions.",
    instructions: "Inspect playable cards, deploy a Unit, and end the Main Phase.",
    startPoint: "main-phase",
  },
  {
    id: "deploy-base-demo",
    group: "Main Phase",
    label: "Deploy a Base",
    description: "Real Base cards in hand with enough active Resources to deploy one.",
    instructions: "Choose a Base, pay its cost, and verify it enters the base section.",
    startPoint: "main-phase",
  },
  {
    id: "deploy-unit-demo",
    group: "Main Phase",
    label: "Deploy a Unit",
    description: "Several real Units in hand spanning different Lv. and Cost values.",
    instructions: "Deploy an affordable Unit and verify the paid Resources become rested.",
    startPoint: "main-phase",
  },
  {
    id: "resource-area-animation-demo",
    group: "Main Phase",
    label: "Place a Resource",
    description:
      "A minimal Main Phase board for repeatedly moving a concealed Resource into the public Resource Area.",
    instructions:
      "Use the fixture Resource control and verify each card moves, reveals, and settles without overlapping the row.",
    startPoint: "main-phase",
  },
  {
    id: "insufficient-resources-demo",
    group: "Main Phase",
    label: "Insufficient Resources",
    description: "Units whose Lv. or Cost cannot be satisfied by the current Resource Area.",
    instructions: "Confirm unaffordable Units are visible but cannot be deployed.",
    startPoint: "main-phase",
  },
  {
    id: "newly-deployed-cannot-attack-demo",
    group: "Main Phase",
    label: "New Unit attack restriction",
    description: "A Unit deployed this turn beside an established Unit that may attack.",
    instructions: "Confirm only the established Unit can declare an attack.",
    startPoint: "main-phase",
  },
  {
    id: "action-only-command-demo",
    group: "Main Phase",
    label: "Action-only Command",
    description: "An Action-timing Command held during the Main Phase.",
    instructions: "Confirm the Command cannot be activated at Main timing.",
    startPoint: "main-phase",
  },
  {
    id: "command-rest-demo",
    group: "Main Phase",
    label: "Command targets a Unit",
    description: "A Command in hand with multiple legal enemy Unit targets.",
    instructions: "Activate the Command, choose a Unit, and verify that Unit becomes rested.",
    startPoint: "main-phase",
  },
  {
    id: "command-auto-resolve-demo",
    group: "Main Phase",
    label: "Targetless Command",
    description: "A targetless Command that can resolve without opening a target picker.",
    instructions: "Activate the Command and verify it resolves directly into trash.",
    startPoint: "main-phase",
  },
  {
    id: "command-multi-target-demo",
    group: "Main Phase",
    label: "Multiple Command targets",
    description: "A dense board for validating legal and illegal Command target highlighting.",
    instructions: "Activate the Command and compare highlighted candidates on both battle areas.",
    startPoint: "main-phase",
  },
  {
    id: "activate-ability-demo",
    group: "Main Phase",
    label: "Activate Main ability",
    description: "A card with an available Activate Main ability and sufficient Resources.",
    instructions: "Activate the ability, resolve its cost and targets, then inspect the result.",
    startPoint: "main-phase",
  },
  {
    id: "pending-effect-click-guard-demo",
    group: "Main Phase",
    label: "Pending effect input guard",
    description: "A pending effect that must block unrelated board actions until it resolves.",
    instructions: "Try an unrelated card, then resolve the pending effect through its prompt.",
    startPoint: "main-phase",
  },
  {
    id: "st10-development-lab",
    group: "ST10 · Generation Pulse",
    label: "Development and Commands",
    description:
      "A 15-Resource Main Phase for ST10 Development costs, recovery, Repair, draw, discard, and alternate Command payment.",
    instructions:
      "Use Tactical Training, deploy both Development Units, play Unlocking the Development Diagram, then Pass Turn for Repair 2.",
    startPoint: "main-phase",
    cards: ["ST10-002", "ST10-003", "ST10-004", "ST10-005", "ST10-008", "ST10-013", "ST10-014"],
  },
  {
    id: "st10-pair-link-lab",
    group: "ST10 · Generation Pulse",
    label: "Pair and Link chains",
    description:
      "Three independent Unit hosts stage When Paired, When Linked, During Pair, and Command-as-Pilot interactions.",
    instructions:
      "Pair Mark with Phoenix, Kamille with Zeta, and Diffuse Beam Cannon with Barbatos; resolve each triggered target chain.",
    startPoint: "main-phase",
    cards: ["ST10-006", "ST10-007", "ST10-011", "ST10-012", "ST10-015"],
  },
  {
    id: "st10-shield-assault-lab",
    group: "ST10 · Generation Pulse",
    label: "Zeta shield assault",
    description:
      "Zeta Gundam (EX) can destroy a single Shield, ready itself, and expose its same-player retarget restriction.",
    instructions:
      "Attack the opposing player, resolve the Shield hit, then attack the rested Unit with the readied Zeta.",
    startPoint: "main-phase",
    cards: ["ST10-001"],
  },
  {
    id: "st10-defense-action-lab",
    group: "ST10 · Generation Pulse",
    label: "Block, Action, and Burst",
    description:
      "An enemy direct attack pauses at your Block Step with two ST10 Blockers, Diffuse Beam Cannon, and a Burst Base.",
    instructions:
      "Block and use Diffuse Beam Cannon, or restart, pass Block, and reveal Luna Mana & Carry Base from Shields.",
    startPoint: "battle",
    cards: ["ST10-009", "ST10-010", "ST10-016"],
  },
  ...RELEASE_REVIEW_SCENARIOS,
  {
    id: "pilot-pair-demo",
    group: "Effects and prompts",
    label: "Pair a Pilot",
    description: "Multiple Pilots in hand and Units in the battle area for Pair legality checks.",
    instructions: "Pair a Pilot with a Unit and verify the Pilot appears beneath its host.",
    startPoint: "main-phase",
  },
  {
    id: "when-paired-trigger-demo",
    group: "Effects and prompts",
    label: "When Paired trigger",
    description: "A Pilot and Unit combination whose When Paired effect should trigger.",
    instructions: "Pair the Pilot, resolve the triggered effect, and inspect the battle log.",
    startPoint: "main-phase",
  },
  {
    id: "when-linked-non-link-demo",
    group: "Effects and prompts",
    label: "Non-Link pairing",
    description: "A Pilot that can Pair but does not satisfy the Unit's Link Condition.",
    instructions: "Pair the Pilot and confirm When Linked behavior does not activate.",
    startPoint: "main-phase",
  },
  {
    id: "link-unit-deploy-demo",
    group: "Effects and prompts",
    label: "Deploy a Link Unit",
    description: "A Pilot and Unit combination that satisfies the printed Link Condition.",
    instructions: "Deploy and Pair the cards, then verify Link-only behavior becomes available.",
    startPoint: "main-phase",
  },
  {
    id: "support-ability-demo",
    group: "Effects and prompts",
    label: "Support",
    description: "A Support Unit and a friendly Unit that can receive its AP increase.",
    instructions:
      "Use Support and verify the selected Unit's AP changes for the intended duration.",
    startPoint: "main-phase",
  },
  {
    id: "attack-trigger-draw-demo",
    group: "Effects and prompts",
    label: "Attack trigger draws",
    description: "A ready attacker whose Attack effect draws from an ordered Deck.",
    instructions: "Declare an attack and verify the triggered draw before battle continues.",
    startPoint: "main-phase",
  },
  {
    id: "attack-trigger-buff-demo",
    group: "Effects and prompts",
    label: "Attack trigger AP increase",
    description: "A ready attacker whose Attack effect changes combat AP.",
    instructions: "Declare an attack and verify the AP increase is visible during the battle.",
    startPoint: "main-phase",
  },
  {
    id: "return-to-hand-demo",
    group: "Effects and prompts",
    label: "Return Unit to hand",
    description: "Multiple enemy Units staged for a return-to-hand effect.",
    instructions:
      "Resolve the effect and verify the selected Unit leaves the battle area for hand.",
    startPoint: "main-phase",
  },
  {
    id: "return-to-deck-demo",
    group: "Effects and prompts",
    label: "Return card to Deck",
    description: "A legal target staged for a return-to-Deck effect.",
    instructions: "Resolve the effect and verify the target moves to the expected Deck position.",
    startPoint: "main-phase",
  },
  {
    id: "striker-pack-choice-demo",
    group: "Effects and prompts",
    label: "Striker Pack choice",
    description: "A card effect paused on a Striker Pack selection.",
    instructions: "Choose one legal option and verify the prompt and resulting zone movement.",
    startPoint: "main-phase",
  },
  {
    id: "optional-prompt-demo",
    group: "Effects and prompts",
    label: "Optional Development effect",
    description: "Gundam Delta Kai is staged for its optional Development 1 deploy effect.",
    instructions:
      "Deploy it, then exercise accept and decline by restarting between the two paths.",
    startPoint: "main-phase",
  },
  {
    id: "deck-look-prompt-demo",
    group: "Effects and prompts",
    label: "Look at the top of the Deck",
    description: "The Path to Victory or Defeat is ready to open a private top-five Deck choice.",
    instructions:
      "Play the Command, choose an eligible card, and verify hidden information stays safe.",
    startPoint: "main-phase",
  },
  {
    id: "battle-ready-demo",
    group: "Battle",
    label: "Ready attackers",
    description: "Ready Units with legal player and rested-Unit attack targets.",
    instructions: "Declare attacks against both target kinds, restarting between paths.",
    startPoint: "main-phase",
  },
  {
    id: "base-combat-demo",
    group: "Battle",
    label: "Attack a Base",
    description: "An opposing Base and Shields staged for direct battle damage.",
    instructions: "Attack the opposing player and verify the Base absorbs damage before Shields.",
    startPoint: "main-phase",
  },
  {
    id: "direct-player-demo",
    group: "Battle",
    label: "Attack the Player",
    description: "A ready Unit faces an opponent with neither a Base nor any Shields remaining.",
    instructions:
      "Open the attack choices and verify the player-damage wording before declaring the attack.",
    startPoint: "main-phase",
  },
  {
    id: "block-step-demo",
    group: "Battle",
    label: "Block Step",
    description: "An attack paused in the Block Step with an active Blocker available.",
    instructions: "Declare the Blocker, then restart and choose Skip Block for both branches.",
    startPoint: "battle",
  },
  {
    id: "first-strike-demo",
    group: "Battle",
    label: "First Strike",
    description: "A battle arranged to expose First Strike damage ordering.",
    instructions:
      "Resolve the battle and verify First Strike damage is applied before retaliation.",
    startPoint: "main-phase",
  },
  {
    id: "high-maneuver-demo",
    group: "Battle",
    label: "High-Maneuver",
    description: "A High-Maneuver attacker facing an otherwise legal Blocker.",
    instructions: "Declare the attack and confirm the enemy Unit cannot activate Blocker.",
    startPoint: "main-phase",
  },
  {
    id: "suppression-demo",
    group: "Battle",
    label: "Suppression",
    description: "A Suppression attacker facing an opposing Shield Area.",
    instructions:
      "Damage the opposing player and verify the first two Shields are handled together.",
    startPoint: "main-phase",
  },
  {
    id: "mutual-destruction-demo",
    group: "Battle",
    label: "Mutual destruction",
    description: "Two battling Units with enough AP to destroy each other.",
    instructions: "Resolve the Damage Step and verify both Units move to trash.",
    startPoint: "main-phase",
  },
  {
    id: "burst-shield-demo",
    group: "Battle",
    label: "Burst from Shield",
    description: "A player attack arranged to destroy and reveal a Shield with Burst.",
    instructions: "Resolve damage, choose whether to activate Burst, and inspect the result.",
    startPoint: "battle",
  },
  {
    id: "step-interrupt-demo",
    group: "Battle",
    label: "Battle step interruption",
    description: "An Attack effect that destroys the selected target before battle damage.",
    instructions:
      "Attack the rested Blocker, resolve the Attack effect, and verify battle ends without counterdamage.",
    startPoint: "main-phase",
  },
  {
    id: "multi-turn-demo",
    group: "Battle",
    label: "Multiple turns",
    description:
      "A state intended for repeated turn passing, readying, drawing, and Resource placement.",
    instructions: "Play through at least two turns and verify the five-phase order.",
    startPoint: "main-phase",
  },
  {
    id: "urgent-timer-demo",
    group: "Battle",
    label: "Urgent timer",
    description: "An active match with little player time remaining for timer presentation checks.",
    instructions:
      "Observe the urgent state and confirm actions remain available before expiration.",
    startPoint: "main-phase",
  },
  {
    id: "discard-limit-demo",
    group: "End Phase",
    label: "Hand limit",
    description: "The End Phase Hand Step with more than ten cards in hand.",
    instructions: "Discard to ten cards and verify the turn proceeds through cleanup.",
    startPoint: "end-phase",
  },
  {
    id: "vs-ai-demo",
    group: "Automation",
    label: "VS AI demo",
    description: "A deterministic local match with an automated opponent.",
    instructions: "Play a full turn and verify the opponent responds without manual input.",
    startPoint: "automation",
  },
  {
    id: "bot-vs-bot",
    group: "Automation",
    label: "Bot versus bot",
    description: "Both player seats controlled by deterministic automation strategies.",
    instructions: "Run or step the bots and inspect decisions, moves, and phase progression.",
    startPoint: "automation",
  },
] as const;

export const GUNDAM_FIXTURE_GROUPS = [
  "Setup",
  "Main Phase",
  "ST10 · Generation Pulse",
  "ST10 · Release review",
  "GD05 · Release review",
  "Battle",
  "Effects and prompts",
  "End Phase",
  "Automation",
] as const satisfies readonly GundamFixtureGroup[];

export function getGundamFixtureScenario(
  id: string | null | undefined,
): GundamFixtureScenario | undefined {
  return GUNDAM_FIXTURE_SCENARIOS.find((scenario) => scenario.id === id);
}
