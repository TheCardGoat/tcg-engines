import type { DomCardPose } from "@tcg/simulator-presentation/dom";
import type { GalleryFixture, MotionGalleryConfig } from "@tcg/simulator-presentation/gallery";
import { grandArchiveOpeningCards as cards } from "../opening-cards";
export const rulesRoot = "https://rules.gatcg.com/general-rules/general-rules-card-types";
export const pose = (
  x: number,
  y: number,
  width = 110,
  face = true,
  rotation = 0,
): DomCardPose => ({
  left: x - width / 2,
  top: y - width * 0.7,
  width,
  height: width * 1.4,
  face,
  rotation,
});
export const slots = {
  hand: pose(575, 535, 125),
  material: pose(170, 510, 110, false),
  stack: pose(610, 255, 170),
  field: pose(740, 445),
  champion: pose(240, 365),
  lineage: pose(228, 381),
  weapon: pose(425, 435),
  domain: pose(840, 425),
  graveyard: pose(1140, 540, 80),
  intent: pose(405, 305, 110),
  pantheon: pose(1060, 240, 120, false),
  enemyA: pose(880, 210, 115),
  enemyB: pose(1110, 210, 100),
};
export const subjects = {
  ally: cards[2],
  action: cards[4],
  weapon: cards[5],
  attack: cards[9],
  champion: {
    name: "Lorraine, Wandering Warrior",
    imageUrl: "https://api.gatcg.com/cards/images/lP5xsEHLGu.jpg",
  },
  item: {
    name: "Potion of Healing",
    imageUrl: "https://api.gatcg.com/cards/images/4yw4gq5w3j.jpg",
  },
  domain: {
    name: "Winbless Hurricane Farm",
    imageUrl: "https://api.gatcg.com/cards/images/4fikevf1qn.jpg",
  },
  phantasia: {
    name: "Sheath of Faceted Lapis",
    imageUrl: "https://api.gatcg.com/cards/images/f896j7wmkr.jpg",
  },
  boon: { name: "Boon · Pantheon type study", imageUrl: undefined },
};
const step = (
  label: string,
  subject: DomCardPose,
  extra: Record<string, DomCardPose> = {},
  duration = 1100,
) => ({ label, duration, poses: { subject, hero: slots.champion, ...extra } });
const fixture = (
  id: keyof typeof subjects,
  title: string,
  detail: string,
  beats: GalleryFixture["beats"],
): GalleryFixture => ({
  id,
  title,
  detail,
  card: subjects[id],
  rule: title,
  rulesUrl: `${rulesRoot}/card-types-${id === "boon" ? "boons" : id}`,
  beats,
});
export const grandArchiveMotions: GalleryFixture[] = [
  fixture(
    "champion",
    "Champion · Materialize",
    "Material deck → Effects Stack → champion lineage. Preserve the champion’s awake/rested state. On Enter effects are omitted.",
    [
      step("Choose from the material deck", slots.material),
      step("Materialize · costs assumed paid", slots.stack),
      step("Level up · join the lineage", slots.champion, { hero: slots.lineage }),
    ],
  ),
  fixture(
    "ally",
    "Ally · Activate",
    "Activate at slow speed. After both players pass, the ally enters the field awake.",
    [
      step("Choose an ally", slots.hand),
      step("Activation · Effects Stack", slots.stack),
      step("Resolve · enter the field", slots.field),
    ],
  ),
  fixture(
    "action",
    "Action · Resolve",
    "Fireball targets a unit. Resolve the effect before placing this reserve-cost Action in the graveyard. Interactive damage is on the Play & Resolve page.",
    [
      step("Choose an Action", slots.hand),
      step("Activation · declare target and pay costs", slots.stack),
      step("Resolve the Action", slots.stack, {}, 900),
      step("Resolution complete · graveyard", slots.graveyard),
    ],
  ),
  fixture(
    "attack",
    "Attack · Intent",
    "Slow-speed activation rests the champion. Resolve into Intent; the attack card leaves Intent at end of combat. Combat choices and damage are omitted.",
    [
      step("Choose an attack", slots.hand),
      step("Activate · rest champion", slots.stack, {
        hero: { ...slots.champion, rotation: -Math.PI / 2 },
      }),
      step("Resolve · declare attack from Intent", slots.intent, {
        hero: { ...slots.champion, rotation: -Math.PI / 2 },
      }),
      step("End of combat · graveyard", slots.graveyard, {
        hero: { ...slots.champion, rotation: -Math.PI / 2 },
      }),
    ],
  ),
  fixture(
    "item",
    "Item · Enter field",
    "Potion of Healing enters as an Item. Its activated sacrifice ability is a separate action, not part of entry.",
    [
      step("Choose an Item", slots.hand),
      step("Activation · Effects Stack", slots.stack),
      step("Resolve · Item enters field", slots.weapon),
    ],
  ),
  fixture(
    "weapon",
    "Weapon · Regalia",
    "Training Sword comes from the material deck. It becomes a field object after materialization resolves; a later attack may wield it.",
    [
      step("Choose a weapon from material", slots.material),
      step("Materialization · Effects Stack", slots.stack),
      step("Resolve · weapon enters field", slots.weapon),
    ],
  ),
  fixture(
    "domain",
    "Domain · Enter field",
    "A Domain is played at slow speed and remains on the field after resolution. Triggered abilities are omitted.",
    [
      step("Choose a Domain", slots.hand),
      step("Activation · Effects Stack", slots.stack),
      step("Resolve · Domain enters field", slots.domain),
    ],
  ),
  fixture(
    "phantasia",
    "Phantasia · Link",
    "Sheath of Faceted Lapis enters linked to a Warrior weapon. Its On Enter draw is omitted in this placement study.",
    [
      step("Choose a Phantasia", slots.hand, { host: slots.weapon }),
      step("Activation · target Training Sword", slots.stack, { host: slots.weapon }),
      step("Resolve · link to weapon", pose(457, 460, 85), { host: slots.weapon }),
    ],
  ),
  fixture(
    "boon",
    "Boon · Pantheon only",
    "Pantheon format only. Bestow rather than activate; no response opportunity during bestowment. The Boon remains in the Pantheon zone. Schematic artwork.",
    [
      step("Face down · Pantheon", slots.pantheon),
      step("Bestow · reveal in Pantheon", { ...slots.pantheon, face: true }),
      step("Bestowed · remain in Pantheon", { ...slots.pantheon, face: true }),
    ],
  ),
];
export const galleryConfig: MotionGalleryConfig = {
  game: "Grand Archive",
  rulesUrl: rulesRoot,
  rulesLabel: "Official rules",
  fixtures: grandArchiveMotions,
  cards: (f) => [
    { ...f.card, id: "subject" },
    { ...cards[0], id: "hero" },
    ...(f.id === "phantasia" ? [{ ...cards[5], id: "host" }] : []),
  ],
  zones: [
    { label: "MATERIAL DECK", x: 112, y: 605 },
    { label: "CHAMPION / LINEAGE", x: 170, y: 465 },
    { label: "EFFECTS STACK", x: 547, y: 388 },
    { label: "FIELD", x: 702, y: 535 },
    { label: "GRAVEYARD", x: 1096, y: 611 },
    { label: "YOUR HAND", x: 533, y: 620 },
  ],
  selected: (f, step, id) => f.id === "phantasia" && step > 0 && id === "host",
};
