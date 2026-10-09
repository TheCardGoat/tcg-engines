import { useEffect, useState } from "react";
import { Button, Text } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import type { CyberpunkTestEngine } from "@tcg/cyberpunk-engine";
import { useEngine } from "../engine";
import { useCyberpunkUiV2 } from "../components/BoardV2/version";
import { BoardSharedPage } from "./BoardShared.page";
import { SetupEditor } from "./creator/SetupEditor";
import {
  buildCreatorEngine,
  captureCreatorSetup,
  CREATOR_STORAGE_KEY,
  emptySetup,
  setupSchema,
  type CreatorSetup,
} from "./creator/setup";
import { CreatorMenuContext } from "./creator/CreatorContext";
import classes from "./creator/creator.module.css";

export function CreatorPage() {
  const [params, setParams] = useSearchParams();
  const [setup, setSetup] = useState<CreatorSetup>(() => {
    try {
      const saved = localStorage.getItem(CREATOR_STORAGE_KEY);
      return saved ? setupSchema.parse(JSON.parse(saved)) : emptySetup();
    } catch {
      return emptySetup();
    }
  });
  const [session, setSession] = useState<{ build: () => CyberpunkTestEngine; id: number } | null>(
    null,
  );
  const [editing, setEditing] = useState(true);
  const [beforeEdit, setBeforeEdit] = useState<CreatorSetup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(setup));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [setup]);
  const start = () => {
    try {
      buildCreatorEngine(setup);
      const snapshot = setupSchema.parse(setup);
      // V2 is the default presentation for new creator sessions.
      if (!params.has("ui")) {
        const next = new URLSearchParams(params);
        next.set("ui", "v2");
        setParams(next, { replace: true });
      }
      setSession((old) => ({ build: () => buildCreatorEngine(snapshot), id: (old?.id ?? 0) + 1 }));
      setEditing(false);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not build this scene.");
    }
  };
  const openEditor = (current: CreatorSetup) => {
    setBeforeEdit(setup);
    setSetup(current);
    setEditing(true);
  };
  const editor =
    editing || !session ? (
      <>
        {storageError && (
          <Text c="orange" role="status">
            Browser save is unavailable. Download your scene to keep it.
          </Text>
        )}
        <SetupEditor
          setup={setup}
          onChange={setSetup}
          onStart={start}
          error={error}
          onCancel={
            session
              ? () => {
                  if (beforeEdit) setSetup(beforeEdit);
                  setEditing(false);
                }
              : undefined
          }
        />
      </>
    ) : null;
  return (
    <>
      {editor}
      {session && (
        <div style={{ display: editing ? "none" : undefined }}>
          <CreatorMenuContext.Provider value={{ name: setup.name, onEdit: openEditor }}>
            <BoardSharedPage
              key={session.id}
              suspendPresentation={editing}
              initialEngineBuilder={session.build}
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
              initialHumanSide={setup.activeSide}
              autoResolveSingletonCardTargets={false}
              localTools={<CreatorTools name={setup.name} onEdit={openEditor} />}
            />
          </CreatorMenuContext.Provider>
        </div>
      )}
    </>
  );
}

function CreatorTools({ name, onEdit }: { name: string; onEdit: (setup: CreatorSetup) => void }) {
  const engine = useEngine();
  const v2 = useCyberpunkUiV2();
  if (v2) return null;
  return (
    <div className={classes.tools} aria-label="Creator tools">
      <Button
        size="xs"
        variant="light"
        onClick={() => {
          engine.setAiMode("step");
          onEdit(captureCreatorSetup(engine.matchState, name));
        }}
      >
        Edit board state
      </Button>
      <Button
        size="xs"
        variant="light"
        onClick={() => {
          engine.setStrategy("player", null);
          engine.setStrategy("opponent", null);
          engine.setAiMode("step");
          engine.toggleHumanSide();
        }}
      >
        Switch player
      </Button>
    </div>
  );
}
