import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button, Group, Modal, Paper, Stack, Text } from "@mantine/core";
import {
  PREGAME_TURN_ORDER_TIMEOUT_MS,
  PregameTurnOrderSchema,
  type PregameTurnOrder,
} from "@tcg/game-page-contract/schemas";
import {
  FabPregameSideboard,
  type FabPregameParticipant,
  type FabPregameSideboardProps,
} from "./FabPregameSideboard";

export function FabFirstPlayerChoice({
  player,
  opponent,
  canChoose,
  deadline,
  onChoose,
  recovery,
}: {
  player: FabPregameParticipant;
  opponent: FabPregameParticipant;
  canChoose: boolean;
  deadline: number;
  onChoose: (goFirst: boolean) => Promise<void> | void;
  recovery?: ReactNode;
}) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [deadline]);
  const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const choose = async (first: boolean) => {
    // The preparation owner enforces expiry; browser clocks can differ from the server.
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await onChoose(first);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your choice. Try again.");
    } finally {
      setPending(false);
    }
  };
  if (!canChoose) {
    return (
      <Paper
        component="section"
        className="fab-first-player-waiting"
        role="status"
        aria-live="polite"
        aria-label="Waiting for the first-player choice"
        data-testid="fab-first-player-choice"
      >
        <Group gap="var(--simulator-surface-gap, 0.5rem)" wrap="nowrap" align="center">
          <div className="min-w-0 flex-1">
            <Text size="sm" fw={600}>
              Waiting for {opponent.label}
            </Text>
            <Text size="xs" c="var(--prompt-menu-muted, #c4afaf)">
              You can prepare your loadout while they choose who goes first.
            </Text>
          </div>
          <Text
            role="timer"
            aria-label="Time to choose turn order"
            size="lg"
            fw={700}
            className="tabular-nums whitespace-nowrap"
          >
            {seconds}s
          </Text>
        </Group>
        {seconds === 0 ? (
          <Text size="xs" mt="xs">
            Selecting the first player…
          </Text>
        ) : null}
        {recovery}
      </Paper>
    );
  }
  return (
    <Modal
      opened
      centered
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title="Choose who goes first"
      radius="md"
      padding="calc(var(--simulator-surface-inset, 0.625rem) * 2)"
      overlayProps={{ backgroundOpacity: 0.72, blur: 2 }}
      styles={{
        content: {
          background: "var(--prompt-menu-surface, #1a1212)",
          color: "var(--prompt-menu-text, #fef2f2)",
        },
        header: {
          background: "var(--prompt-menu-surface, #1a1212)",
          color: "var(--prompt-menu-text, #fef2f2)",
          minHeight: "var(--simulator-panel-header-height, 2.5rem)",
        },
        title: { fontSize: "var(--mantine-font-size-lg)", fontWeight: 600 },
      }}
    >
      <Stack gap="md" data-testid="fab-first-player-choice">
        <Group
          gap="var(--simulator-surface-gap, 0.5rem)"
          wrap="nowrap"
          align="center"
          py="var(--simulator-surface-inset, 0.625rem)"
          style={{ borderBlock: "1px solid var(--prompt-menu-border, #654747)" }}
        >
          <Text size="sm" fw={600} flex={1} style={{ overflowWrap: "anywhere" }}>
            {player.heroName ?? player.label}
          </Text>
          <Text size="xs" c="var(--prompt-menu-muted, #c4afaf)">
            vs
          </Text>
          <Text size="sm" fw={600} flex={1} ta="right" style={{ overflowWrap: "anywhere" }}>
            {opponent.heroName ?? opponent.label}
          </Text>
        </Group>
        <Text size="sm" c="var(--prompt-menu-muted, #c4afaf)">
          Choose your turn order before selecting your starting deck and equipment.
        </Text>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="xs" c="var(--prompt-menu-muted, #c4afaf)">
            At zero, who starts is selected randomly.
          </Text>
          <Text
            role="timer"
            aria-label="Time to choose turn order"
            size="xl"
            fw={700}
            className="tabular-nums whitespace-nowrap"
          >
            {seconds}s
          </Text>
        </Group>
        {error && (
          <Text role="alert" c="red">
            {error}
          </Text>
        )}
        {seconds === 0 && (
          <Text size="sm" role="status">
            Selecting the first player…
          </Text>
        )}
        <Group grow gap="var(--simulator-surface-gap, 0.5rem)">
          <Button
            color="#f3c866"
            autoContrast
            h="var(--simulator-action-rail-height, 2.75rem)"
            radius="sm"
            disabled={pending}
            onClick={() => void choose(true)}
          >
            Go first
          </Button>
          <Button
            variant="outline"
            color="var(--prompt-menu-muted, #c4afaf)"
            h="var(--simulator-action-rail-height, 2.75rem)"
            radius="sm"
            disabled={pending}
            onClick={() => void choose(false)}
          >
            Go second
          </Button>
        </Group>
        {recovery}
      </Stack>
    </Modal>
  );
}

/** Local practice preserves the same deadline and ordering across reloads. */
export function FabPracticePreparation({
  storageKey,
  onConfirm,
  ...props
}: Omit<FabPregameSideboardProps, "onConfirm"> & {
  storageKey: string;
  onConfirm: (
    selection: Parameters<FabPregameSideboardProps["onConfirm"]>[0],
    firstPlayerId: string,
  ) => void;
}) {
  const [turnOrder, setTurnOrder] = useState<PregameTurnOrder>(() => {
    try {
      const saved = PregameTurnOrderSchema.safeParse(
        JSON.parse(sessionStorage.getItem(storageKey) ?? "null"),
      );
      if (saved.success) return saved.data;
    } catch {
      /* Session storage is optional. */
    }
    const chooserId =
      crypto.getRandomValues(new Uint8Array(1))[0]! % 2 === 0 ? "player-1" : "player-2";
    const order: PregameTurnOrder =
      chooserId === "player-1"
        ? { stage: "choosing", chooserId }
        : { stage: "chosen", chooserId, firstPlayerId: chooserId, source: "bot" };
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(order));
    } catch {
      /* optional persistence */
    }
    return order;
  });
  const [deadline] = useState(() => {
    const key = `${storageKey}:choice-deadline`;
    try {
      const saved = Number(sessionStorage.getItem(key));
      if (Number.isFinite(saved) && saved > 0) return saved;
    } catch {
      /* optional persistence */
    }
    const value = Date.now() + PREGAME_TURN_ORDER_TIMEOUT_MS;
    try {
      sessionStorage.setItem(key, String(value));
    } catch {
      /* optional persistence */
    }
    return value;
  });
  const orderRef = useRef(turnOrder);
  const commitChoice = useCallback(
    (first: boolean, source: "player" | "timeout") => {
      if (orderRef.current.stage !== "choosing") return;
      const expired = source === "player" && Date.now() >= deadline;
      const goesFirst = expired ? crypto.getRandomValues(new Uint8Array(1))[0]! % 2 === 0 : first;
      const order: PregameTurnOrder = {
        stage: "chosen",
        chooserId: orderRef.current.chooserId,
        firstPlayerId: goesFirst ? "player-1" : "player-2",
        source: expired ? "timeout" : source,
      };
      orderRef.current = order;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(order));
      } catch {
        /* optional persistence */
      }
      setTurnOrder(order);
    },
    [storageKey, deadline],
  );
  useEffect(() => {
    if (turnOrder.stage !== "choosing") return;
    const expire = () => {
      if (Date.now() >= deadline)
        commitChoice(crypto.getRandomValues(new Uint8Array(1))[0]! % 2 === 0, "timeout");
    };
    expire();
    const timer = setInterval(expire, 250);
    return () => clearInterval(timer);
  }, [deadline, turnOrder.stage, commitChoice]);
  const clearPreparation = () => {
    try {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(`${storageKey}:choice-deadline`);
    } catch {
      /* optional persistence */
    }
  };
  return (
    <FabPregameSideboard
      {...props}
      onLeave={() => {
        clearPreparation();
        props.onLeave();
      }}
      turnOrderLabel={
        turnOrder.stage === "choosing"
          ? "Choosing turn order"
          : turnOrder.firstPlayerId === "player-1"
            ? "You go first"
            : "You go second"
      }
      turnOrderDialog={
        turnOrder.stage === "choosing" ? (
          <FabFirstPlayerChoice
            player={props.player}
            opponent={props.opponent}
            canChoose
            deadline={deadline}
            onChoose={(first) => commitChoice(first, "player")}
          />
        ) : undefined
      }
      onConfirm={(selection) => {
        if (orderRef.current.stage !== "chosen") return;
        onConfirm(selection, orderRef.current.firstPlayerId);
        clearPreparation();
      }}
    />
  );
}
