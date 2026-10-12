import { useEffect, useState } from "react";
import { Button, Group, NumberInput, Select, Stack, Text } from "@mantine/core";
import { AC_JUDGE_COUNTERS, AC_JUDGE_ZONES, AC_JUDGE_MOVE_IDS } from "@tcg/alpha-clash-engine";
import type { AcJudgeCommand } from "@tcg/alpha-clash-engine";
import { getCard } from "@tcg/alpha-clash-cards";
import type { AcSeat, LiveBoardState } from "./board-types";
import type { useGameStateCorrection } from "../../../simulator/correction/useGameStateCorrection";

export type CorrectionSession = ReturnType<typeof useGameStateCorrection>;
export function CorrectionBanner({
  session,
  viewerId,
  disabled,
}: {
  session: CorrectionSession;
  viewerId: string;
  disabled: boolean;
}) {
  if (!session.enabled && !session.proposal) return null;
  const incoming = session.proposal && session.proposal.senderPlayerId !== viewerId;
  return (
    <div
      role="status"
      data-testid="ac-correction-banner"
      className="pointer-events-auto absolute left-1/2 top-4 z-40 flex max-w-[90vw] -translate-x-1/2 flex-wrap items-center gap-3 rounded-lg border border-amber-400/60 bg-slate-950 px-4 py-3 text-sm text-white shadow-xl"
    >
      <span>
        {session.enabled
          ? "Game state correction active. Normal play is paused."
          : incoming
            ? "Opponent requests game state correction."
            : "Waiting for opponent approval."}
      </span>
      {session.enabled ? (
        <Button size="xs" color="orange" disabled={disabled} onClick={session.exit}>
          Exit correction
        </Button>
      ) : incoming ? (
        <Group gap="xs">
          <Button size="xs" disabled={disabled} onClick={session.accept}>
            Accept correction
          </Button>
          <Button size="xs" variant="outline" disabled={disabled} onClick={session.decline}>
            Decline correction
          </Button>
        </Group>
      ) : null}
    </div>
  );
}
const toolLabels = {
  manualSetHealth: "Set health",
  manualSetDamage: "Set damage",
  manualSetCounter: "Set counters",
  manualReadyCard: "Ready card",
  manualExertCard: "Engage card",
  manualReadyAll: "Ready all",
  manualMoveCard: "Move card",
  manualSetCardFace: "Set card face",
  manualDrawCard: "Draw cards",
  manualShuffleDeck: "Shuffle deck",
  manualAttachWeapon: "Attach Weapon",
  manualDetachWeapon: "Detach Weapon",
  manualSetPortal: "Set Portal",
  manualResetOncePerTurn: "Reset ability use",
} satisfies Record<AcJudgeCommand["type"], string>;
const cardTools: readonly AcJudgeCommand["type"][] = [
  "manualSetDamage",
  "manualSetCounter",
  "manualReadyCard",
  "manualExertCard",
  "manualMoveCard",
  "manualSetCardFace",
  "manualResetOncePerTurn",
];
const playerTools: readonly AcJudgeCommand["type"][] = [
  "manualSetHealth",
  "manualReadyAll",
  "manualDrawCard",
  "manualShuffleDeck",
];

/** Inputs use only the viewer-safe projection; enabling correction reveals no extra cards. */
export function GameStateCorrection({
  board,
  viewerSeat,
  session,
  disabled,
}: {
  board: LiveBoardState;
  viewerSeat: AcSeat;
  session: CorrectionSession;
  disabled: boolean;
}) {
  const [tool, setTool] = useState<AcJudgeCommand["type"]>("manualSetHealth");
  const [targetPlayerId, setTargetPlayerId] = useState<AcSeat>(viewerSeat);
  const [cardId, setCardId] = useState<string | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);
  const [abilityIndex, setAbilityIndex] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | string>(0);
  const [damageType, setDamageType] = useState("clash");
  const [counter, setCounter] = useState("bounty");
  const [targetZone, setTargetZone] = useState("hand");
  const [position, setPosition] = useState("top");
  const [face, setFace] = useState("up");
  const [portal, setPortal] = useState(board.portalOpen ? "open" : "closed");
  const cards = board.cards.filter((card) => card.name !== null && card.zone !== "deck");
  const selected = cards.find((card) => card.instanceId === cardId);
  const abilities = selected?.definitionId
    ? (getCard(selected.definitionId).abilities ?? []).flatMap((ability, index) =>
        ability.kind === "activated" && ability.oncePerTurn
          ? [{ value: String(index), label: ability.text }]
          : [],
      )
    : [];
  useEffect(() => {
    if (tool === "manualSetHealth") setAmount(board.players[targetPlayerId].health);
    else if (tool === "manualSetDamage" && selected)
      setAmount(damageType === "clash" ? selected.clashDamage : selected.phaseDamage);
    else if (tool === "manualSetCounter" && selected) setAmount(selected.counters?.[counter] ?? 0);
    else if (tool === "manualDrawCard") setAmount(1);
  }, [tool, selected, board.players, targetPlayerId, damageType, counter]);
  if (!session.enabled)
    return (
      <Button
        size="xs"
        variant="outline"
        disabled={disabled || Boolean(session.proposal)}
        onClick={session.request}
      >
        Request game state correction
      </Button>
    );
  const needsCard =
    cardTools.includes(tool) || tool === "manualAttachWeapon" || tool === "manualDetachWeapon";
  const needsAmount = [
    "manualSetHealth",
    "manualSetDamage",
    "manualSetCounter",
    "manualDrawCard",
  ].includes(tool);
  const submit = () => {
    const payload: Record<string, unknown> = {};
    if (playerTools.includes(tool)) payload.targetPlayerId = targetPlayerId;
    if (cardTools.includes(tool)) payload.cardId = cardId;
    if (needsAmount) payload[tool === "manualDrawCard" ? "count" : "amount"] = amount;
    if (tool === "manualResetOncePerTurn") payload.abilityIndex = Number(abilityIndex);
    if (tool === "manualSetDamage") payload.damageType = damageType;
    if (tool === "manualSetCounter") payload.counter = counter;
    if (tool === "manualMoveCard") {
      payload.targetZone = targetZone;
      if (targetZone === "deck") payload.position = position;
    }
    if (tool === "manualSetCardFace") payload.faceDown = face === "down";
    if (tool === "manualSetPortal") payload.open = portal === "open";
    if (tool === "manualAttachWeapon" || tool === "manualDetachWeapon") payload.weaponId = cardId;
    if (tool === "manualAttachWeapon") payload.targetId = hostId;
    session.execute(tool, payload);
  };
  return (
    <Stack gap="xs" data-testid="ac-correction-tools">
      <Text size="sm" fw={700}>
        Game state correction
      </Text>
      <Select
        label="Correction"
        value={tool}
        data={AC_JUDGE_MOVE_IDS.map((value) => ({ value, label: toolLabels[value] }))}
        onChange={(value) => {
          const type = AC_JUDGE_MOVE_IDS.find((type) => type === value);
          if (type) setTool(type);
        }}
        allowDeselect={false}
      />
      {playerTools.includes(tool) ? (
        <Select
          label="Player"
          value={targetPlayerId}
          data={[
            { value: viewerSeat, label: "You" },
            { value: viewerSeat === "player-one" ? "player-two" : "player-one", label: "Opponent" },
          ]}
          onChange={(value) => {
            if (value === "player-one" || value === "player-two") setTargetPlayerId(value);
          }}
          allowDeselect={false}
        />
      ) : null}
      {needsCard ? (
        <Select
          label={tool === "manualAttachWeapon" || tool === "manualDetachWeapon" ? "Weapon" : "Card"}
          searchable
          value={cardId}
          data={cards.map((card) => ({
            value: card.instanceId,
            label:
              (card.controller === viewerSeat ? "You" : "Opponent") +
              " · " +
              card.name +
              " · " +
              card.zone,
          }))}
          onChange={setCardId}
        />
      ) : null}
      {tool === "manualAttachWeapon" ? (
        <Select
          label="Host"
          searchable
          value={hostId}
          data={cards
            .filter((card) => card.zone === "clash" || card.zone === "contender")
            .map((card) => ({ value: card.instanceId, label: card.name ?? "" }))}
          onChange={setHostId}
        />
      ) : null}
      {tool === "manualSetDamage" ? (
        <Select
          label="Damage type"
          value={damageType}
          data={[
            { value: "clash", label: "Clash damage" },
            { value: "phase", label: "Phase damage" },
          ]}
          onChange={(value) => value && setDamageType(value)}
          allowDeselect={false}
        />
      ) : null}
      {tool === "manualSetCounter" ? (
        <Select
          label="Counter"
          value={counter}
          data={AC_JUDGE_COUNTERS.map((value) => ({
            value,
            label: value[0].toUpperCase() + value.slice(1),
          }))}
          onChange={(value) => value && setCounter(value)}
          allowDeselect={false}
        />
      ) : null}
      {tool === "manualMoveCard" ? (
        <>
          <Select
            label="Destination"
            value={targetZone}
            data={[...AC_JUDGE_ZONES]}
            onChange={(value) => value && setTargetZone(value)}
            allowDeselect={false}
          />
          {targetZone === "deck" ? (
            <Select
              label="Deck position"
              value={position}
              data={["top", "bottom"]}
              onChange={(value) => value && setPosition(value)}
              allowDeselect={false}
            />
          ) : null}
        </>
      ) : null}
      {tool === "manualSetCardFace" ? (
        <Select
          label="Card face"
          value={face}
          data={[
            { value: "up", label: "Face up" },
            { value: "down", label: "Face down" },
          ]}
          onChange={(value) => value && setFace(value)}
          allowDeselect={false}
        />
      ) : null}
      {tool === "manualSetPortal" ? (
        <Select
          label="Portal"
          value={portal}
          data={["open", "closed"]}
          onChange={(value) => value && setPortal(value)}
          allowDeselect={false}
        />
      ) : null}
      {tool === "manualResetOncePerTurn" ? (
        <Select
          label="Ability"
          value={abilityIndex}
          data={abilities}
          onChange={setAbilityIndex}
          placeholder="Choose a once-per-turn ability"
        />
      ) : null}
      {needsAmount ? (
        <NumberInput
          label={tool === "manualDrawCard" ? "Cards to draw" : "New value"}
          min={tool === "manualDrawCard" ? 1 : 0}
          max={tool === "manualSetHealth" ? board.players[targetPlayerId].maxHealth : undefined}
          allowDecimal={false}
          value={amount}
          onChange={setAmount}
        />
      ) : null}
      <Button
        size="xs"
        color="orange"
        disabled={
          disabled ||
          (needsCard && !cardId) ||
          (tool === "manualAttachWeapon" && !hostId) ||
          (tool === "manualResetOncePerTurn" &&
            !abilities.some((ability) => ability.value === abilityIndex)) ||
          (needsAmount && (typeof amount !== "number" || !Number.isSafeInteger(amount)))
        }
        onClick={submit}
      >
        Apply correction
      </Button>
      <Text size="xs" c="dimmed">
        Changes are logged. Costs and card effects do not run.
      </Text>
    </Stack>
  );
}
