import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import {
  grandArchivePreparationCards,
  validateGrandArchivePreparation,
  type GrandArchivePreparationPool,
  type GrandArchivePreparationSelection,
} from "@tcg/grand-archive-server-adapter/preparation";

interface Props {
  pool: GrandArchivePreparationPool;
  initialSelection: GrandArchivePreparationSelection;
  playerLabel: string;
  opponentLabel: string;
  opponentReady: boolean;
  locked?: boolean;
  deadline?: number;
  turnOrderLabel: string;
  turnOrderControl?: ReactNode;
  recovery?: ReactNode;
  externalError?: string | null;
  onConfirm: (selection: GrandArchivePreparationSelection) => Promise<void> | void;
  onLeave: () => void;
}
const sectionNames = {
  main: "Main deck",
  material: "Material deck",
  sideboard: "Sideboard",
} as const;
type Section = keyof typeof sectionNames;

export function GrandArchivePreparation(props: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [selection, setSelection] = useState(props.initialSelection);
  const [section, setSection] = useState<Section>("main");
  const [density, setDensity] = useState("8");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (props.locked) setSelection(props.initialSelection);
  }, [props.locked, props.initialSelection]);
  useEffect(() => {
    if (!props.deadline) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [props.deadline]);
  const cards = useMemo(() => grandArchivePreparationCards(props.pool), [props.pool]);
  const validation = useMemo(
    () => validateGrandArchivePreparation(props.pool, selection),
    [props.pool, selection],
  );
  const disabled = !hydrated || busy || props.locked;
  const sideboarding = props.pool.stage === "sideboarding";
  const count = (s: Section) => selection[s].reduce((total, card) => total + card.quantity, 0);
  const quantity = (id: string, s: Section) =>
    selection[s].find((card) => card.canonicalId === id)?.quantity ?? 0;
  const points = selection.sideboard.reduce(
    (total, entry) =>
      total +
      entry.quantity *
        (cards.find((card) => card.canonicalId === entry.canonicalId)?.material ? 3 : 1),
    0,
  );
  const move = (id: string, from: Section, to: Section) =>
    setSelection((current) => {
      if (
        !sideboarding ||
        disabled ||
        !current[from].some((card) => card.canonicalId === id && card.quantity > 0)
      )
        return current;
      const source = current[from]
        .map((card) => (card.canonicalId === id ? { ...card, quantity: card.quantity - 1 } : card))
        .filter((card) => card.quantity > 0);
      const target = current[to].some((card) => card.canonicalId === id)
        ? current[to].map((card) =>
            card.canonicalId === id ? { ...card, quantity: card.quantity + 1 } : card,
          )
        : [...current[to], { canonicalId: id, quantity: 1 }];
      return { ...current, [from]: source, [to]: target };
    });
  const selectedPreview = cards.find((card) => card.canonicalId === preview);
  const seconds = props.deadline ? Math.max(0, Math.ceil((props.deadline - now) / 1000)) : null;
  return (
    <Stack
      gap="sm"
      p="sm"
      h="100dvh"
      style={{ overflow: "hidden" }}
      bg="var(--mantine-color-dark-9)"
    >
      <Stack gap="sm" className="min-h-0 flex-1 overflow-y-auto sm:overflow-visible">
        <Paper withBorder p="md">
          <Group justify="space-between" align="start" wrap="nowrap" gap="xs">
            <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" c="gray.4">
                You
              </Text>
              <Title order={3} fz={{ base: "sm", sm: "xl" }} style={{ overflowWrap: "anywhere" }}>
                {props.playerLabel}
              </Title>
              <Badge
                w="max-content"
                style={{ maxWidth: "none", flexShrink: 0 }}
                color={props.locked ? "teal" : "yellow"}
              >
                {props.locked ? "Ready" : "Preparing"}
              </Badge>
            </Stack>
            <Stack gap={4} align="center" style={{ flexShrink: 0 }}>
              <Text fw={700}>Grand Archive</Text>
              <Badge style={{ maxWidth: "none", flexShrink: 0 }} variant="outline">
                {props.turnOrderLabel}
              </Badge>
              <Text size="xs" c="gray.4">
                Standard · {sideboarding ? "Between games" : "Game one"}
                {seconds !== null
                  ? ` · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
                  : ""}
              </Text>
            </Stack>
            <Stack gap={4} align="end" style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" c="gray.4">
                Opponent
              </Text>
              <Title order={3} fz={{ base: "sm", sm: "xl" }} style={{ overflowWrap: "anywhere" }}>
                {props.opponentLabel}
              </Title>
              <Badge
                w="max-content"
                style={{ maxWidth: "none", flexShrink: 0 }}
                color={props.opponentReady ? "teal" : "gray"}
              >
                {props.opponentReady ? "Ready" : "Preparing"}
              </Badge>
            </Stack>
          </Group>
        </Paper>
        <Paper withBorder p="md">
          <Group justify="space-between" align="start">
            <Stack gap={4}>
              <Title order={3}>
                {sideboarding ? "Prepare your next game" : "Review your starting decks"}
              </Title>
              <Text size="sm" c="gray.4">
                {sideboarding
                  ? "Move registered cards between your decks and sideboard. Confirm a legal selection before play."
                  : "Game one uses your registered deck sections. Sideboarding is available between games."}
              </Text>
              <Text size="xs" c="gray.4">
                Your deck contents and Spirit selection stay private until the game begins.
              </Text>
            </Stack>
            {props.turnOrderControl}
          </Group>
        </Paper>
        <Paper withBorder p="md" className="sm:min-h-0 sm:flex-1 sm:overflow-y-auto">
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                {(Object.keys(sectionNames) as Section[]).map((s) => (
                  <Button
                    key={s}
                    variant={section === s ? "filled" : "subtle"}
                    onClick={() => setSection(s)}
                    aria-pressed={section === s}
                  >
                    {sectionNames[s]} · {count(s)}
                  </Button>
                ))}
              </Group>
              <SegmentedControl
                visibleFrom="lg"
                aria-label="Cards per row"
                value={density}
                onChange={setDensity}
                data={["4", "8", "12"]}
              />
            </Group>
            <Group justify="space-between">
              <Title order={4}>{sectionNames[section]}</Title>
              <Text size="sm" c="gray.4">
                {section === "main"
                  ? `${count("main")} cards · 60 minimum`
                  : section === "material"
                    ? `${count("material")} cards · 12 maximum before card effects`
                    : `${count("sideboard")} cards · ${points}/15 points`}
              </Text>
            </Group>
            {count(section) === 0 && (
              <Text c="gray.4">
                No cards in this section.
                {sideboarding ? " Move cards here from your other sections." : ""}
              </Text>
            )}
            <SimpleGrid
              cols={{ base: 2, xs: 3, sm: Math.min(4, Number(density)), lg: Number(density) }}
              spacing="xs"
            >
              {cards
                .filter((card) => quantity(card.canonicalId, section) > 0)
                .map((card) => (
                  <Paper key={card.canonicalId} withBorder p={4}>
                    <UnstyledButton
                      onClick={() => setPreview(card.canonicalId)}
                      aria-label={`Preview ${card.name}`}
                      style={{ width: "100%" }}
                    >
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          loading="lazy"
                          style={{
                            width: "100%",
                            aspectRatio: "2.5 / 3.5",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      ) : (
                        <Text>{card.name}</Text>
                      )}
                    </UnstyledButton>
                    <Text size="xs" fw={600} lineClamp={1} title={card.name}>
                      {card.name}
                    </Text>
                    <Group justify="space-between" gap={4}>
                      <Text size="sm">×{quantity(card.canonicalId, section)}</Text>
                      {sideboarding && (
                        <Button
                          size="compact-xs"
                          variant="light"
                          disabled={disabled}
                          onClick={() =>
                            move(
                              card.canonicalId,
                              section,
                              section === "sideboard"
                                ? card.material
                                  ? "material"
                                  : "main"
                                : "sideboard",
                            )
                          }
                          aria-label={`Move ${card.name} to ${section === "sideboard" ? (card.material ? "material deck" : "main deck") : "sideboard"}`}
                        >
                          {section === "sideboard" ? "Add to deck" : "Side out"}
                        </Button>
                      )}
                    </Group>
                  </Paper>
                ))}
            </SimpleGrid>
          </Stack>
        </Paper>
        <Paper withBorder p="md">
          <Group justify="space-between" align="center">
            <Stack gap={4}>
              <Text fw={700}>Starting Spirit Champion</Text>
              <Text size="xs" c="gray.4">
                Revealed simultaneously when both players finish preparation.
              </Text>
            </Stack>
            <Select
              aria-label="Starting Spirit Champion"
              value={selection.startingChampionId}
              disabled={disabled}
              allowDeselect={false}
              data={cards
                .filter((card) => card.spirit && quantity(card.canonicalId, "material") > 0)
                .map((card) => ({ value: card.canonicalId, label: card.name }))}
              onChange={(value) => {
                if (value) setSelection((current) => ({ ...current, startingChampionId: value }));
              }}
            />
          </Group>
        </Paper>
      </Stack>
      <Paper withBorder p="md" style={{ flexShrink: 0 }}>
        <Stack gap="xs">
          {props.recovery}
          {(error || props.externalError) && (
            <Alert color="red" role="alert">
              {error ?? props.externalError}
            </Alert>
          )}
          {!validation.valid && (
            <Alert color="yellow" role="alert">
              {validation.issues.map((issue) => (
                <Text size="sm" key={issue.code}>
                  {issue.message}
                </Text>
              ))}
            </Alert>
          )}
          <Group justify="space-between">
            <Text role="status" c={validation.valid ? "teal" : "yellow"}>
              {props.locked
                ? "Selection confirmed · waiting for the match"
                : validation.valid
                  ? "Legal selection · ready to confirm"
                  : "Adjust your selection to continue"}
            </Text>
            <Group gap="xs">
              <Button
                variant="default"
                disabled={disabled}
                onClick={() => {
                  setSelection(props.initialSelection);
                  setError(null);
                }}
              >
                Reset
              </Button>
              <Button variant="default" onClick={props.onLeave}>
                Leave
              </Button>
              <Button
                color="yellow"
                loading={busy}
                disabled={!hydrated || !validation.valid || props.locked}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    await props.onConfirm(selection);
                  } catch (cause) {
                    setError(
                      cause instanceof Error ? cause.message : "Could not confirm selection.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Confirm selection
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>
      <Modal
        closeButtonProps={{ "aria-label": "Close card preview" }}
        opened={Boolean(selectedPreview)}
        onClose={() => setPreview(null)}
        title={selectedPreview?.name}
        centered
        size="sm"
      >
        {selectedPreview?.imageUrl && (
          <img
            src={selectedPreview.imageUrl}
            alt={selectedPreview.name}
            style={{ width: "100%", maxHeight: "75dvh", objectFit: "contain" }}
          />
        )}
      </Modal>
    </Stack>
  );
}
