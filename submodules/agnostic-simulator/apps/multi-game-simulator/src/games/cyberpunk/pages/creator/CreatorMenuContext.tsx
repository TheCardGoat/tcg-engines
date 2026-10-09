import { useContext } from "react";
import { Button } from "@mantine/core";
import { Pencil } from "lucide-react";
import classes from "../../components/BoardV2/MatchViewportV2.module.css";
import { useEngine } from "../../engine";
import { captureCreatorSetup } from "./setup";
import { CreatorMenuContext } from "./CreatorContext";

export function CreatorMenuAction({ onClose }: { onClose: () => void }) {
  const creator = useContext(CreatorMenuContext);
  const engine = useEngine();
  if (!creator) return null;
  return (
    <Button
      fullWidth
      variant="light"
      mb="md"
      onClick={() => {
        engine.setAiMode("step");
        creator.onEdit(captureCreatorSetup(engine.matchState, creator.name));
        onClose();
      }}
    >
      Edit board state
    </Button>
  );
}

export function CreatorSceneShortcut() {
  const creator = useContext(CreatorMenuContext);
  const engine = useEngine();
  if (!creator) return null;
  return (
    <button
      type="button"
      className={classes.menu}
      aria-label="Edit board state"
      title="Update the current scene"
      onClick={() => {
        engine.setAiMode("step");
        creator.onEdit(captureCreatorSetup(engine.matchState, creator.name));
      }}
    >
      <Pencil size={18} aria-hidden="true" />
      <span>Edit scene</span>
    </button>
  );
}
