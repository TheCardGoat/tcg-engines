import { Check } from "lucide-react";
import { Menu } from "@mantine/core";
import { useState } from "react";
import {
  CYBERPUNK_BOARD_SURFACES,
  preloadBoardSurface,
  setBoardSurface,
  type BoardSurface,
  type BoardSurfacePreset,
} from "./boardSurface";
import classes from "./board.module.css";

/** Commit the selection only once the texture is warm; keep the old one on failure. */
async function adoptSurface(surface: BoardSurfacePreset): Promise<boolean> {
  try {
    await preloadBoardSurface(surface);
  } catch {
    return false;
  }
  setBoardSurface(surface.id);
  return true;
}

export function BoardSurfacePicker({ surface }: { surface: BoardSurface }) {
  const [failed, setFailed] = useState(false);
  return (
    <Menu position="bottom-end" onClose={() => setFailed(false)}>
      <Menu.Target>
        <button
          type="button"
          className={classes.surfaceButton}
          aria-label={`Board surface: ${surface.label}. Change board surface.`}
          title="Change the board surface"
        >
          Surface
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Board surface</Menu.Label>
        {Object.values(CYBERPUNK_BOARD_SURFACES).map((preset) => (
          <Menu.Item
            key={preset.id}
            data-surface-id={preset.id}
            leftSection={
              preset.id === surface.id ? <Check size={14} aria-hidden="true" /> : undefined
            }
            onClick={() => {
              void adoptSurface(preset).then((adopted) => {
                if (!adopted) setFailed(true);
              });
            }}
          >
            {preset.label}
          </Menu.Item>
        ))}
        {failed && <Menu.Item disabled>Surface could not load</Menu.Item>}
      </Menu.Dropdown>
    </Menu>
  );
}
