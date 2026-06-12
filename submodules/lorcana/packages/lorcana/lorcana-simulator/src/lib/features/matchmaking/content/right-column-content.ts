import { marked } from "marked";
import bulletinRaw from "./bulletin.md?raw";

export const bulletinHtml = marked.parse(bulletinRaw) as string;

export type CommunityHighlight = {
  title: string;
  body: string;
  chips: string[];
};

export const communityHighlight: CommunityHighlight = {
  title: "Bring your testing pod",
  body: "Use the lobby as a staging ground before events, team sessions, or late-night gauntlets. The shell is built to leave room for community signals and ad inventory later.",
  chips: ["Testing nights", "Format watch", "Deck clinics"],
};
