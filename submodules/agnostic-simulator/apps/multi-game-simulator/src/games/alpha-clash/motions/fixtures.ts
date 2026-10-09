import type { DomCardPose } from "@tcg/simulator-presentation/dom";
import type { SimulatorAudioCueId } from "@tcg/protocol";
export const rulesUrl = "https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf";
export interface MotionCard {
  name: string;
  imageUrl?: string;
}
export interface MotionBeat {
  label: string;
  duration: number;
  poses: Record<string, DomCardPose>;
  cue?: SimulatorAudioCueId;
}
export interface TypeMotion {
  id: string;
  title: string;
  rule: string;
  detail: string;
  card: MotionCard;
  beats: MotionBeat[];
}
const art = (name: string, product: number): MotionCard => ({
  name,
  imageUrl: `https://tcgplayer-cdn.tcgplayer.com/product/${product}_400w.jpg`,
});
const pose = (x: number, y: number, width = 105, face = true, rotation = 0): DomCardPose => ({
  left: x - width / 2,
  top: y - width * 0.7,
  width,
  height: width * 1.4,
  face,
  rotation,
});
export const slots = {
  hand: pose(640, 555, 120),
  standby: pose(640, 265, 170),
  field: pose(850, 340),
  contender: pose(200, 340),
  accessory: pose(420, 420),
  ground: pose(640, 135, 85),
  oblivion: pose(1100, 370, 82),
  attached: pose(885, 365, 80),
  heroAttached: pose(235, 365, 80),
  resource: pose(490, 565, 76, true, Math.PI),
  omen: pose(930, 330),
};
const base = { subject: slots.hand, host: slots.field, hero: slots.contender };
const beat = (
  label: string,
  subject: DomCardPose,
  cue?: SimulatorAudioCueId,
  extra: Record<string, DomCardPose> = {},
  duration = 1150,
): MotionBeat => ({ label, duration: duration * 0.9, cue, poses: { ...base, subject, ...extra } });
const start = () => beat("Choose a card", slots.hand, undefined, {}, 900);
const standby = () =>
  beat("Pay cost · Standby · Response window", slots.standby, "card.play", {}, 1400);
const discard = () =>
  beat("Resolution complete · Oblivion", slots.oblivion, "card.discard", {}, 1100);
export const typeMotions: TypeMotion[] = [
  {
    id: "contender",
    title: "Contender",
    rule: "301 / 103",
    detail: "Starts in the Contender Zone. It is not played from hand.",
    card: art("Magnate, Awakened", 535079),
    beats: [
      beat("Reveal before play", { ...slots.standby, face: false }),
      beat("Reveal Contender", slots.standby, "card.reveal"),
      beat("Set starting health · Contender Zone", slots.contender, "card.move", {
        hero: { ...slots.contender, left: -400 },
      }),
    ].map((b) => ({ ...b, poses: { ...b.poses, hero: { ...slots.contender, left: -400 } } })),
  },
  {
    id: "clash",
    title: "Clash",
    rule: "303 / 601",
    detail: "Resolves into the Clash Zone ready. It can normally attack that turn.",
    card: art("Captain Maxine Riggins", 534928),
    beats: [start(), standby(), beat("Enter ready · Clash Zone", pose(630, 355), "card.move")],
  },
  {
    id: "clashground",
    title: "Clashground",
    rule: "302.6",
    detail: "The old Clashground leaves before the new one enters. Only one is active.",
    card: art("Denver", 534924),
    beats: [
      start(),
      standby(),
      beat("Previous Clashground → Oblivion", slots.standby, "card.discard", {
        old: slots.oblivion,
      }),
      beat("New global effect · Clashground Zone", slots.ground, "effect.trigger", {
        old: slots.oblivion,
      }),
    ].map((b) => ({ ...b, poses: { old: slots.ground, ...b.poses } })),
  },
  {
    id: "trap",
    title: "Accessory · Trap",
    rule: "304",
    detail: "Set free, face down. Activate on a later turn in the matching response window.",
    card: art("Sharpshooter Moxie", 534947),
    beats: [
      start(),
      beat("Set face down · No cost", { ...slots.accessory, face: false }, "card.move"),
      beat(
        "Later turn · Counter–Play window · Pay cost",
        { ...slots.accessory, face: false },
        undefined,
        {},
        1400,
      ),
      beat("Reveal · Resolve the Trap", slots.standby, "card.reveal"),
      discard(),
    ],
  },
  {
    id: "weapon",
    title: "Accessory · Weapon",
    rule: "305",
    detail: "Play to the Accessory Zone. Pay a separate attach cost to equip a Clash card.",
    card: art("Moxie's Sidearm", 534943),
    beats: [
      start(),
      standby(),
      beat("Enter ready · Accessory Zone", slots.accessory, "card.move"),
      beat("Pay attach cost · Equip Clash card", slots.attached, "resource.spend"),
    ],
  },
  {
    id: "contender-weapon",
    title: "Accessory · Contender Weapon",
    rule: "310",
    detail: "Play to the Accessory Zone, then pay to attach to an eligible Contender.",
    card: { name: "Contender Weapon · Type sample" },
    beats: [
      start(),
      standby(),
      beat("Enter ready · Accessory Zone", slots.accessory, "card.move"),
      beat("Pay attach cost · Equip Contender", slots.heroAttached, "resource.spend"),
    ],
  },
  {
    id: "relic",
    title: "Accessory · Relic",
    rule: "309",
    detail: "Resolves into the Accessory Zone ready and stays in play.",
    card: art("Veil of Convergence", 535393),
    beats: [
      start(),
      standby(),
      beat("Persistent effect · Accessory Zone", slots.accessory, "effect.trigger"),
    ],
  },
  {
    id: "basic",
    title: "Action · Basic",
    rule: "307",
    detail: "Play during your Primary Phase. Resolve from Standby, then send to Oblivion.",
    card: art("Webber's Assistance", 534942),
    beats: [start(), standby(), beat("Resolve effect", slots.standby, "effect.trigger"), discard()],
  },
  {
    id: "quick",
    title: "Action · Quick",
    rule: "308",
    detail: "Play in a matching response window. Resolve, then send to Oblivion.",
    card: art("Surprise!", 534941),
    beats: [
      beat("Matching Counter–Attack window", slots.hand),
      standby(),
      beat("Resolve response", slots.standby, "effect.trigger"),
      discard(),
    ],
  },
  {
    id: "clash-buff",
    title: "Action · Clash Buff",
    rule: "306",
    detail: "Play in C4 or C5. Resolve the buff on an eligible target, then discard the Action.",
    card: { name: "Clash Buff · Type sample" },
    beats: [
      beat("C4 / C5 · Select eligible target", slots.hand),
      standby(),
      beat("Buff resolves · Target highlighted", slots.standby, "effect.trigger", {
        host: { ...slots.field, width: 113.4, height: 158.76, top: slots.field.top - 12 },
      }),
      discard(),
    ],
  },
  {
    id: "empowerment",
    title: "Action · Empowerment",
    rule: "311",
    detail: "Resolves from Standby and stays attached. It goes to Oblivion when its host leaves.",
    card: { name: "Empowerment · Type sample" },
    beats: [
      start(),
      standby(),
      beat("Resolve · Attach to eligible card", slots.attached, "effect.trigger"),
      beat("Later · Host leaves play", slots.oblivion, "card.discard", {
        host: { ...slots.oblivion, left: slots.oblivion.left - 20, top: slots.oblivion.top - 22 },
      }),
    ],
  },
  {
    id: "omen",
    title: "Action · Omen",
    rule: "312",
    detail:
      "Stays in play after resolution, then leaves at the start of its controller’s next turn.",
    card: { name: "Omen · Type sample" },
    beats: [
      start(),
      standby(),
      beat("Enter play · Continuous effect", slots.omen, "effect.trigger"),
      beat("Start of your next turn · Oblivion", slots.oblivion, "card.discard"),
    ],
  },
  {
    id: "resource",
    title: "Resource placement",
    rule: "408",
    detail:
      "Not a card type. Deploy a hand card face up, inverted and ready during the Resource Step.",
    card: art("Sonoro", 534959),
    beats: [
      start(),
      beat("Deploy · Face up and inverted", slots.resource, "resource.gain"),
      beat(
        "Later · Engage to pay a cost",
        { ...slots.resource, rotation: Math.PI * 1.5 },
        "resource.spend",
      ),
    ],
  },
  {
    id: "ambush",
    title: "Clash · Ambush",
    rule: "704.17",
    detail:
      "A keyword, not a card type. Set as a Trap; a later legal activation puts it in the Clash Zone.",
    card: art("Gur, Savage Aggressor", 550323),
    beats: [
      start(),
      beat("Set as a Trap", { ...slots.accessory, face: false }, "card.move"),
      beat(
        "Later turn · Portal open · Counter–Play",
        { ...slots.accessory, face: false },
        undefined,
        {},
        1400,
      ),
      beat("Reveal Ambush", slots.standby, "card.reveal"),
      beat("Enter ready · Clash Zone", pose(630, 355), "card.move"),
    ],
  },
];
