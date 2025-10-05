import { playCardMove } from "./play-card";
import type { LorcanaMove } from "./types";

export interface SingTogetherOptions {
  song: string; // instanceId of the song card to sing
  singers: string[]; // instanceIds of the characters to sing together
}

export const singTogetherMove: LorcanaMove = {
  execute: (context, options: SingTogetherOptions) => {
    return playCardMove.execute(context, options.song, {
      alternativeCost: {
        type: "sing-together",
        targetInstanceId: options.singers,
      },
    });
  },
};
