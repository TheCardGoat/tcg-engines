import { playCardMove } from "./play-card";
import type { LorcanaEnumerableMove, LorcanaMove } from "./types";

export interface SingOptions {
  song: string; // instanceId of the song card to sing
  singer: string; // instanceId of the character to sing with
}

export const singMove: LorcanaMove = {
  execute: (context, options: SingOptions) => {
    return playCardMove.execute(context, options.song, {
      alternativeCost: {
        type: "sing",
        targetInstanceId: [options.singer],
      },
    });
  },
};
