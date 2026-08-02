/**
 * Card inspector with computed stats: effective power (base + bonus, x2 when
 * doubled this turn), remaining health (health - damage), support timing/cost.
 * Fed by hover/focus or the current selection.
 */

import { getCardById } from "@tcg-engines/naruto-cards";
import { cardOf, effectivePower, findCharacter } from "@tcg-engines/naruto-engine";
import type { GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { cardImageUrl, supportTimingLabel } from "../projection/labels.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import type { EntityZoneKind } from "./types.ts";

export interface InspectorProps {
  readonly state: GameState;
  readonly uid: string | null;
  readonly zone: EntityZoneKind | null;
  readonly owner: PlayerId | null;
}

interface InspectedCard {
  readonly cardId: string;
  readonly title: string;
  readonly typeLabel: string;
  readonly lines: readonly string[];
  readonly skills: readonly string[];
}

function resolveInspected(
  state: GameState,
  uid: string,
  zone: EntityZoneKind,
  owner: PlayerId | null,
): InspectedCard | null {
  if (zone === "leader" && owner) {
    const seat = state.players[owner];
    const card = getCardById(seat.leaderId);
    if (!card) return null;
    return {
      cardId: card.id,
      title: card.nameEn,
      typeLabel: "Leader",
      lines: [
        `Life ${seat.life}`,
        `Power ${card.power ?? 0}${seat.leaderRested ? " - rested" : ""}`,
      ],
      skills: card.skills.map((s) => `[${s.labels.join(", ")}] ${s.text}`),
    };
  }
  if (zone === "character") {
    const location = findCharacter(state, uid);
    if (!location) return null;
    const card = cardOf(location.character);
    if (!card) return null;
    const character = location.character;
    const base = (card.power ?? 0) + character.powerBonus;
    const power = effectivePower(character, state.turn);
    const lines = [
      character.powerBonus > 0 || power !== base
        ? `Power ${card.power ?? 0}${character.powerBonus > 0 ? ` + ${character.powerBonus}` : ""}${power !== base ? ` x2 = ${power}` : ` = ${power}`}`
        : `Power ${power}`,
      `Damage ${character.damage} / Health ${card.health ?? 0} (${Math.max(0, (card.health ?? 0) - character.damage)} remaining)`,
      character.rested ? "Rested" : "Ready",
    ];
    return {
      cardId: card.id,
      title: card.nameEn,
      typeLabel: card.cardType === "ex_character" ? "EX Character" : "Character",
      lines,
      skills: card.skills.map((s) => `[${s.labels.join(", ")}] ${s.text}`),
    };
  }
  if (zone === "support" && owner) {
    const support = state.players[owner].supports.find((s) => s?.uid === uid);
    if (!support) return null;
    const card = cardOf(support);
    if (!card?.support) return null;
    return {
      cardId: card.id,
      title: card.support.name,
      typeLabel: `Support - ${supportTimingLabel(card.support.timing)}`,
      lines: [
        `Cost ${card.support.cost ?? 0} chakra`,
        support.revealed ? "Revealed (on chain)" : "Set face-down",
      ],
      skills: [card.support.text],
    };
  }
  if ((zone === "hand" || zone === "trash") && owner) {
    const pile = zone === "hand" ? state.players[owner].hand : state.players[owner].trash;
    const instance = pile.find((c) => c.uid === uid);
    if (!instance) return null;
    const card = cardOf(instance);
    if (!card) return null;
    const lines: string[] = [];
    if (card.power !== null) lines.push(`Power ${card.power}`);
    if (card.damage !== null) lines.push(`Damage ${card.damage}`);
    if (card.health !== null) lines.push(`Health ${card.health}`);
    if (card.support) lines.push(`Support cost ${card.support.cost ?? 0}`);
    const skills = card.support
      ? [
          `${card.support.name}: ${card.support.text}`,
          ...card.skills.map((s) => `[${s.labels.join(", ")}] ${s.text}`),
        ]
      : card.skills.map((s) => `[${s.labels.join(", ")}] ${s.text}`);
    return {
      cardId: card.id,
      title: card.nameEn,
      typeLabel:
        card.cardType === "ex_character"
          ? "EX Character"
          : card.cardType === "character"
            ? "Character"
            : "Card",
      lines,
      skills,
    };
  }
  return null;
}

export function Inspector({ state, uid, zone, owner }: InspectorProps) {
  const inspected = uid && zone ? resolveInspected(state, uid, zone, owner) : null;
  return (
    <section
      className={classes.railSection}
      data-testid="naruto-inspector"
      aria-label="Card inspector"
    >
      <h3 className={classes.railTitle}>Inspector</h3>
      {inspected ? (
        <div
          className={`${classes.inspector} ${animations.inspectorIn}`}
          key={inspected.cardId + inspected.title}
        >
          <img className={classes.inspectorArt} src={cardImageUrl(inspected.cardId)} alt="" />
          <div>
            <p className={classes.inspectorName}>{inspected.title}</p>
            <p className={classes.inspectorType}>{inspected.typeLabel}</p>
            <p className={classes.inspectorStats}>
              {inspected.lines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            {inspected.skills.slice(0, 3).map((skill) => (
              <p key={skill} className={classes.inspectorSkill}>
                {skill}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p className={classes.inspectorEmpty}>Hover or select a card to inspect it.</p>
      )}
    </section>
  );
}
