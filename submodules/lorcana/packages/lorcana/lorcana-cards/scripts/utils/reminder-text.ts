import type { SupportedLocale } from "../types";
import { normalizeCardTextContent } from "./structured-card-text";

const SONG_REMINDER_PATTERNS: Record<SupportedLocale, RegExp[]> = {
  en: [/\(\s*A character with cost \d+ or more can(?: [^)]+)? sing this song for free\.\s*\)\s*/gi],
  de: [
    /\(\s*Du kannst einen Charakter, der \d+ oder mehr kostet,[^)]*dieses Lied kostenlos singt\.\s*\)\s*/gi,
  ],
  fr: [
    /\(\s*Vous pouvez un personnage coûtant \d+ ou plus[^)]*chanter cette chanson gratuitement\.\s*\)\s*/gi,
  ],
  it: [
    /\(\s*Un personaggio con costo \d+ o più può cantare questa canzone gratuitamente\.\s*\)\s*/gi,
    /\(\s*A character with cost \d+ or more can(?: [^)]+)? sing this song for free\.\s*\)\s*/gi,
  ],
};

const REMINDER_PATTERNS: Record<SupportedLocale, RegExp[]> = {
  en: [
    /\(\s*You may pay \d+ \{I\} to play this on top of one of your characters named [^.)]+\.\s*\)/gi,
    /\(\s*This character counts as cost \d+ to sing songs\.\s*\)/gi,
    /\(\s*Whenever (?:this|these) character(?:s)? quests, you may add their \{S\} to another chosen character's \{S\} this turn\.\s*\)/gi,
    /\(\s*This character may enter play exerted\. An opposing character who challenges one of your characters must choose one with Bodyguard if able\.\s*\)/gi,
    /\(\s*Only characters with Evasive can challenge (?:this character|them)\.\s*\)/gi,
    /\(\s*Opponents can't choose (?:this character|them) except to challenge\.\s*\)/gi,
    /\(\s*This character can challenge the turn they're played\.\s*\)/gi,
    /\(\s*This character can't quest and must challenge each turn if able\.\s*\)/gi,
    /\(\s*While challenging, this character gets \+\d+(?: \{S\})?\.\s*\)/gi,
    /\(\s*Damage dealt to (?:this character|them) is reduced by \d+(?: for each other [^.]+)?\.\s*\)/gi,
    /\(\s*Once during your turn, you may pay \d+ \{I\} to put the top card of your deck facedown under this character\.\s*\)/gi,
  ],
  de: [
    /\(\s*Du kannst \d+ zahlen, um diesen Charakter auf einen deiner [^.]+ auszuspielen\.\s*\)/gi,
    /\(\s*Dieser Charakter zählt als Kosten \d+, um Lieder zu singen\.\s*\)/gi,
    /\(\s*Einmal während deines Zuges darfst du \d+ bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen\.\s*\)/gi,
    /\(\s*Einmal während deines Zuges darfst du \d+ bezahlen, um die oberste Karte deines Decks verdeckt unter diese Karte zu legen\.\s*\)/gi,
    /\(\s*Dieser Charakter kann erschöpft ins Spiel kommen\. Ein gegnerischer Charakter, der einen deiner Charaktere herausfordert, muss, falls möglich, einen Charakter mit Bodyguard wählen\.\s*\)/gi,
    /\(\s*Nur Charaktere mit Wendig können (?:diesen|jenen|den) Charakter herausfordern\.\s*\)/gi,
    /\(\s*Gegnerische Karten können (?:diesen|jenen) Charakter nicht auswählen, außer um (?:ihn|sie) herauszufordern\.\s*\)/gi,
    /\(\s*Gegnerische Mitspielende können (?:diesen|jenen) Charakter nicht auswählen, außer um (?:ihn|sie) herauszufordern\.\s*\)/gi,
    /\(\s*Dieser Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird\.\s*\)/gi,
    /\(\s*Dieser Charakter kann nicht erkunden und muss in jedem Zug herausfordern, wenn möglich\.\s*\)/gi,
    /\(\s*Während dieser Charakter herausfordert, erhält er \+\d+\.\s*\)/gi,
    /\(\s*Jeglicher diesem Charakter zugefügte Schaden wird um \d+ reduziert\.\s*\)/gi,
    /\(\s*Dem Charakter zugefügter Schaden wird um \d+ reduziert\.\s*\)/gi,
    /\(\s*Der diesem Charakter zugefügte Schaden wird um \d+ reduziert\.\s*\)/gi,
  ],
  fr: [
    /\(\s*Vous pouvez payer \d+ pour jouer ce personnage sur l'un de vos personnages [^.)]+\.\s*\)/gi,
    /\(\s*Ce personnage compte pour un coût de \d+ pour chanter des chansons\.\s*\)/gi,
    /\(\s*Une fois durant votre tour, vous pouvez payer \d+ pour placer la carte du dessus de votre pioche sous cette carte, face cachée\.\s*\)/gi,
    /\(\s*Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter (?:sa|leur) à celle d'un autre personnage au choix pour le reste de ce tour\.\s*\)/gi,
    /\(\s*Ce personnage peut entrer en jeu épuisé\. Un personnage adverse qui défie l'un de vos personnages doit en choisir un avec Garde du corps si possible\.\s*\)/gi,
    /\(\s*Seuls les personnages avec Insaisissable peuvent défier (?:ce personnage|them)\.\s*\)/gi,
    /\(\s*Les adversaires ne peuvent pas choisir (?:ce personnage|them),? hormis pour un défi\.\s*\)/gi,
    /\(\s*Ce personnage peut défier le tour où il est joué\.\s*\)/gi,
    /\(\s*Ce personnage ne peut pas être envoyé à l'aventure et doit défier à chaque tour s'il le peut\.\s*\)/gi,
    /\(\s*Lorsqu'il défie, ce personnage gagne \+\d+(?: \{S\})?\.\s*\)/gi,
    /\(\s*Les dommages (?:infligés à ce personnage|qui lui sont infligés|qui leur sont infligés) sont réduits de \d+(?: par [^.]+)?\.\s*\)/gi,
  ],
  it: [
    /\(\s*Puoi pagare \d+ per giocare questa carta sopra a uno dei tuoi personaggi chiamato [^.)]+\.\s*\)/gi,
    /\(\s*Questo personaggio conta come di costo \d+ per cantare le canzoni\.\s*\)/gi,
    /\(\s*Ogni volta che questo personaggio va all'avventura, puoi aggiungere la (?:sua|loro) alla di un altro personaggio a tua scelta per questo turno\.\s*\)/gi,
    /\(\s*Questo personaggio può entrare in gioco impegnato\. Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile\.\s*\)/gi,
    /\(\s*Solo altri personaggi con Sfuggente possono sfidare (?:questo personaggio|(?:questi|quei) personaggi)\.\s*\)/gi,
    /\(\s*Gli avversari non possono scegliere (?:questo personaggio|(?:questi|quei) personaggi) se non per sfidar(?:lo|li)\.\s*\)/gi,
    /\(\s*Questo personaggio può entrare in gioco impegnato\. Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile\.\s*\)/gi,
    /\(\s*Questo personaggio può sfidare nel turno in cui viene giocato\.\s*\)/gi,
    /\(\s*Questo personaggio non può andare all'avventura e deve sfidare ogni turno, se possibile\.\s*\)/gi,
    /\(\s*Mentre sta sfidando, questo personaggio riceve \+\d+(?: \{S\})?\.\s*\)/gi,
    /\(\s*Riceve \+\d+ mentre sta sfidando\.\s*\)/gi,
    /\(\s*Il danno (?:inflitto a questo personaggio|che gli viene inflitto) è ridotto di \d+(?: per [^.]+)?\.\s*\)/gi,
  ],
};

function cleanupReminderSpacing(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

export function stripReminderText(text: string, locale: SupportedLocale): string {
  let normalized = normalizeCardTextContent(text).trim();

  for (const pattern of SONG_REMINDER_PATTERNS[locale]) {
    normalized = normalized.replace(pattern, "");
  }

  for (const pattern of REMINDER_PATTERNS[locale]) {
    normalized = normalized.replace(pattern, "");
  }

  return cleanupReminderSpacing(normalized);
}
