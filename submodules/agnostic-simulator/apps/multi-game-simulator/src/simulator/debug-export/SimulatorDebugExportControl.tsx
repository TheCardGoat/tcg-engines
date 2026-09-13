import { useCallback, useMemo, useRef, useState } from "react";
import { Button, NumberInput, Popover, Text } from "@mantine/core";
import { IconBraces, IconCheck, IconClipboard, IconDownload } from "@tabler/icons-react";
import type { SimulatorDebugExportV1 } from "@tcg/game-page-contract/debug-export";
import { useSimulatorViewportLayout } from "@tcg/simulator-ui";

import { useSimulatorRoute } from "../providers";
import {
  copySimulatorDebugExport,
  downloadSimulatorDebugExport,
  fetchHostedSimulatorDebugExport,
  serializeSimulatorDebugExport,
  simulatorDebugExportFilename,
} from "./debug-export-client";
import { useSimulatorDebugExportSource } from "./SimulatorDebugExportContext";
import classes from "./SimulatorDebugExportControl.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

interface PreparedExport {
  readonly startMove: number;
  readonly endMove: number;
  readonly value: SimulatorDebugExportV1;
  readonly serialized: string;
}

export function SimulatorDebugExportControl() {
  const route = useSimulatorRoute();
  const layout = useSimulatorViewportLayout();
  const registeredSource = useSimulatorDebugExportSource();
  const [opened, setOpened] = useState(false);
  const [preview, setPreview] = useState<SimulatorDebugExportV1 | null>(null);
  const [startMove, setStartMove] = useState(1);
  const [endMove, setEndMove] = useState(1);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const preparedExportRef = useRef<PreparedExport | null>(null);
  const source = useMemo(
    () =>
      registeredSource ??
      (route.gameSlug && route.gameId
        ? {
            load: (request: { startMove?: number; endMove?: number }) =>
              fetchHostedSimulatorDebugExport(route.gameSlug!, route.gameId!, request),
          }
        : null),
    [registeredSource, route.gameId, route.gameSlug],
  );

  const loadPreview = useCallback(async () => {
    if (!source) {
      setStatus({ kind: "error", message: "This practice session has no debug history source." });
      return;
    }
    setStatus({ kind: "loading", message: "Loading debug history…" });
    try {
      const value = await source.load({});
      if (!value || value.range.totalMoves === 0) {
        setStatus({ kind: "error", message: "No accepted moves are available yet." });
        return;
      }
      preparedExportRef.current = null;
      setPreview(value);
      setStartMove(value.range.startMove);
      setEndMove(value.range.endMove);
      setStatus({ kind: "idle" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: debugExportErrorMessage(error, "Unable to load debug history."),
      });
    }
  }, [source]);

  const exportRange = async (action: "copy" | "download") => {
    if (!source || !preview) return;
    setStatus({ kind: "loading", message: "Building selected range…" });
    try {
      let prepared = preparedExportRef.current;
      if (!prepared || prepared.startMove !== startMove || prepared.endMove !== endMove) {
        const value = await source.load({ startMove, endMove });
        if (!value) throw new Error("The selected debug history is unavailable.");
        prepared = {
          startMove,
          endMove,
          value,
          serialized: serializeSimulatorDebugExport(value),
        };
        preparedExportRef.current = prepared;
      }
      if (action === "copy") {
        await copySimulatorDebugExport(prepared.serialized);
        setStatus({ kind: "success", message: "JSON copied to clipboard." });
      } else {
        downloadSimulatorDebugExport(
          prepared.serialized,
          simulatorDebugExportFilename(prepared.value),
        );
        setStatus({ kind: "success", message: "JSON download started." });
      }
    } catch (error) {
      setStatus({
        kind: "error",
        message: debugExportErrorMessage(error, "Unable to export debug history."),
      });
    }
  };

  const totalMoves = preview?.range.totalMoves ?? 0;
  const invalidRange =
    startMove < 1 || endMove < startMove || (totalMoves > 0 && endMove > totalMoves);

  return (
    <div className={classes.anchor} data-testid="simulator-debug-export">
      <Popover
        opened={opened}
        onChange={setOpened}
        position={layout === "mobile" ? "top-end" : "right-end"}
        width={320}
        shadow="md"
        withinPortal
      >
        <Popover.Target>
          <Button
            className={classes.trigger}
            variant="subtle"
            size="sm"
            fullWidth
            justify="flex-start"
            leftSection={<IconBraces size={17} aria-hidden="true" />}
            aria-label="Export simulator debug history"
            onClick={() => {
              const next = !opened;
              setOpened(next);
              if (next && !preview && status.kind !== "loading") void loadPreview();
            }}
          >
            Export debug JSON
          </Button>
        </Popover.Target>
        <Popover.Dropdown className={classes.panel}>
          <div className={classes.header}>
            <div>
              <Text fw={700} size="sm">
                Debug history
              </Text>
              <Text c="dimmed" size="xs">
                Initial state, accepted moves, and domain events.
              </Text>
            </div>
            {status.kind === "success" ? <IconCheck size={16} aria-hidden="true" /> : null}
          </div>

          {preview ? (
            <>
              <div className={classes.range}>
                <NumberInput
                  label="Start move"
                  value={startMove}
                  onChange={(value) => setStartMove(typeof value === "number" ? value : 1)}
                  min={1}
                  max={totalMoves}
                  allowDecimal={false}
                  clampBehavior="strict"
                  size="xs"
                />
                <NumberInput
                  label="End move"
                  value={endMove}
                  onChange={(value) => setEndMove(typeof value === "number" ? value : totalMoves)}
                  min={startMove}
                  max={totalMoves}
                  allowDecimal={false}
                  clampBehavior="strict"
                  size="xs"
                />
              </div>
              <Text c="dimmed" size="xs">
                {totalMoves} accepted moves available.
              </Text>
              <div className={classes.actions}>
                <Button
                  size="xs"
                  variant="default"
                  leftSection={<IconClipboard size={15} aria-hidden="true" />}
                  disabled={invalidRange || status.kind === "loading"}
                  onClick={() => void exportRange("copy")}
                >
                  Copy JSON
                </Button>
                <Button
                  size="xs"
                  leftSection={<IconDownload size={15} aria-hidden="true" />}
                  disabled={invalidRange || status.kind === "loading"}
                  onClick={() => void exportRange("download")}
                >
                  Download
                </Button>
              </div>
            </>
          ) : null}

          {status.kind !== "idle" ? (
            <Text
              className={classes.status}
              c={status.kind === "error" ? "red.4" : "dimmed"}
              size="xs"
              role="status"
            >
              {status.message}
            </Text>
          ) : null}
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}

function debugExportErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  return error.name === "ZodError"
    ? "Debug history contains data that cannot be represented as JSON."
    : error.message;
}
