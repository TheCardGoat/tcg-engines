export const tutorialLocales = ["en", "fr", "de", "es", "it", "pt-br"] as const;
export type TutorialLocale = (typeof tutorialLocales)[number];

export type FabGuideStepId =
  | "cards"
  | "attack"
  | "defend"
  | "pitch"
  | "settings"
  | "report"
  | "priority"
  | "bug"
  | "correction"
  | "undo";

export interface FabGuideStepCopy {
  title: string;
  desktop: string;
  mobile: string;
}

export interface FabGuideCopy {
  label: string;
  invitation: string;
  start: string;
  done: string;
  step: (current: number, total: number) => string;
  back: string;
  next: string;
  finish: string;
  skip: string;
  replay: string;
  minimize: string;
  restore: string;
  returnToPractice: string;
  steps: Record<FabGuideStepId, FabGuideStepCopy>;
}

export const fabGuideStepIds: readonly FabGuideStepId[] = [
  "cards",
  "attack",
  "defend",
  "pitch",
  "settings",
  "report",
  "priority",
  "bug",
  "correction",
  "undo",
];

export const fabFirstGameMessages: Record<TutorialLocale, FabGuideCopy> = {
  en: {
    label: "Your first game",
    invitation: "New to Flesh and Blood here? Try a short guided game before playing someone.",
    start: "Try the guided game",
    done: "You can return to practice, or open the guide again whenever you want.",
    step: (current, total) => `Step ${current} of ${total}`,
    back: "Back",
    next: "Next",
    finish: "Finish guide",
    skip: "Skip guide",
    replay: "Show first-game guide",
    minimize: "Minimize guide",
    restore: "Restore guide",
    returnToPractice: "Back to practice",
    steps: {
      cards: {
        title: "Move and play cards",
        desktop:
          "Click a card in your hand to see what you can do. You can also drag it onto a highlighted area. Only moves allowed right now will work.",
        mobile:
          "Tap a card in your hand to see what you can do. You can also drag it. If dragging is hard, use the card actions instead.",
      },
      attack: {
        title: "Attack",
        desktop:
          "Click your weapon, or an attack action in your hand, when you have priority and an action point. Then choose the attack the card offers.",
        mobile:
          "Tap your weapon, or an attack action in your hand, when you have priority and an action point. Then choose the attack the card offers.",
      },
      defend: {
        title: "Defend",
        desktop:
          "When an attack is aimed at you, click a card in your hand or a piece of equipment, such as your chest piece, and declare it as a defending card.",
        mobile:
          "When an attack is aimed at you, tap a card in your hand or your chest equipment and declare it as a defending card.",
      },
      pitch: {
        title: "Pitch to pay",
        desktop:
          "Playing a card spends resource points. Pitch a card from your hand into this Pitch zone. Red pitches for 1, yellow for 2, and blue for 3.",
        mobile:
          "Tap this Pitch pile. Pitch a card from your hand to pay its pitch value: red 1, yellow 2, and blue 3.",
      },
      settings: {
        title: "Change game settings",
        desktop:
          "Open the menu beside your name, Open your player actions. Choose Settings, then the Game tab. You can change match options without leaving the game.",
        mobile:
          "Tap Open match menu at the bottom left. Open Seats, then the menu beside your name, choose Settings, and open the Game tab.",
      },
      report: {
        title: "Report a player",
        desktop:
          "In a live match, open the menu in this opponent area and choose Report player. This practice opponent is a sample. Nothing is sent until you submit the form.",
        mobile:
          "This is your opponent summary. In a live match, tap Open match menu, open Seats, and choose Report player. Nothing is sent until you submit the form.",
      },
      priority: {
        title: "Hold priority",
        desktop:
          "Select Hold next priority window beside your name to keep your next priority window instead of passing it. Pass when you are ready to continue.",
        mobile:
          "Tap Open match menu, open Seats, and select Hold next priority window beside your name to keep your next priority window.",
      },
      bug: {
        title: "The game can fail",
        desktop:
          "The game can fail. Open the menu beside your name, Open your player actions, and choose Report bug so we can fix it. Always send a report when something breaks. This is separate from Report player. Nothing is sent until you submit the form.",
        mobile:
          "The game can fail. Tap Open match menu at the bottom left, open Seats, then the menu beside your name, and choose Report bug so we can fix it. Always send a report when something breaks. This is separate from Report player. Nothing is sent until you submit the form.",
      },
      correction: {
        title: "Correct the board",
        desktop:
          "If a bug happens in the middle of a match, you can correct the board. Against a bot, or in local practice, correction turns on without a person accepting. Against a human, you request it and both players can edit only after it is accepted. Fix the cards, then leave correction and keep playing.",
        mobile:
          "If a bug happens in the middle of a match, you can correct the board from this layout. Against a bot, or in local practice, correction turns on without a person accepting. Against a human, you request it and both players can edit only after it is accepted. Fix the cards, then leave correction and keep playing.",
      },
      undo: {
        title: "Undo an action",
        desktop:
          "Choose Undo to put back the latest action. Choose Undo turn to return play to the start of the current turn. In a ranked live match the opponent must accept. In other matches the undo applies without asking.",
        mobile:
          "Open the match menu and choose Undo to put back the latest action. Choose Undo turn to return play to the start of the current turn. In a ranked live match the opponent must accept. In other matches the undo applies without asking.",
      },
    },
  },
  fr: {
    label: "Votre première partie",
    invitation:
      "Vous débutez à Flesh and Blood ? Essayez une courte partie guidée avant de jouer contre quelqu’un.",
    start: "Essayer la partie guidée",
    done: "Vous pouvez revenir à l’entraînement ou rouvrir le guide quand vous voulez.",
    step: (current, total) => `Étape ${current} sur ${total}`,
    back: "Retour",
    next: "Suivant",
    finish: "Terminer le guide",
    skip: "Passer le guide",
    replay: "Voir le guide de première partie",
    minimize: "Réduire le guide",
    restore: "Afficher le guide",
    returnToPractice: "Retour à l’entraînement",
    steps: {
      cards: {
        title: "Déplacez et jouez des cartes",
        desktop:
          "Cliquez sur une carte de votre main pour voir vos actions. Vous pouvez aussi la glisser vers une zone en surbrillance. Seules les actions autorisées fonctionnent.",
        mobile:
          "Touchez une carte de votre main pour voir vos actions. Vous pouvez aussi la glisser. Si le geste est difficile, utilisez les actions de la carte.",
      },
      attack: {
        title: "Attaquez",
        desktop:
          "Cliquez sur votre arme, ou sur une attack action dans votre main, quand vous avez la priorité et un action point. Choisissez ensuite l’attaque proposée.",
        mobile:
          "Touchez votre arme, ou une attack action dans votre main, quand vous avez la priorité et un action point. Choisissez ensuite l’attaque proposée.",
      },
      defend: {
        title: "Défendez",
        desktop:
          "Quand une attaque vous vise, cliquez sur une carte de votre main ou un équipement, comme votre chest, et déclarez-la defending card.",
        mobile:
          "Quand une attaque vous vise, touchez une carte de votre main ou votre équipement chest et déclarez-la defending card.",
      },
      pitch: {
        title: "Pitchez pour payer",
        desktop:
          "Jouer une carte dépense des resource points. Pitchez une carte de votre main dans cette zone Pitch. Rouge = 1, jaune = 2, bleu = 3.",
        mobile:
          "Touchez cette pile Pitch. Pitchez une carte de votre main pour sa valeur : rouge 1, jaune 2, bleu 3.",
      },
      settings: {
        title: "Réglez la partie",
        desktop:
          "Ouvrez le menu près de votre nom, Open your player actions. Choisissez Settings, puis l’onglet Game. Vous pouvez changer les options sans quitter la partie.",
        mobile:
          "Touchez Open match menu en bas à gauche. Ouvrez Seats, puis le menu près de votre nom, choisissez Settings et l’onglet Game.",
      },
      report: {
        title: "Signalez un joueur",
        desktop:
          "En partie en direct, ouvrez le menu de cette zone adverse et choisissez Report player. L’adversaire de cet entraînement est un exemple. Rien n’est envoyé avant le formulaire.",
        mobile:
          "Voici le résumé de l’adversaire. En partie en direct, touchez Open match menu, ouvrez Seats, puis Report player. Rien n’est envoyé avant le formulaire.",
      },
      priority: {
        title: "Gardez la priorité",
        desktop:
          "Utilisez Hold next priority window près de votre nom pour garder votre prochaine fenêtre de priorité au lieu de passer. Passez quand vous êtes prêt.",
        mobile:
          "Touchez Open match menu, ouvrez Seats, puis Hold next priority window près de votre nom pour garder votre prochaine fenêtre de priorité.",
      },
      bug: {
        title: "La partie peut échouer",
        desktop:
          "La partie peut échouer. Ouvrez le menu près de votre nom, Open your player actions, et choisissez Report bug pour que nous puissions corriger. Signalez toujours un bug quand quelque chose casse. C'est distinct de Report player. Rien n'est envoyé avant l'envoi du formulaire.",
        mobile:
          "La partie peut échouer. Touchez Open match menu en bas à gauche, ouvrez Seats, puis le menu près de votre nom, et choisissez Report bug pour que nous puissions corriger. Signalez toujours un bug quand quelque chose casse. C'est distinct de Report player. Rien n'est envoyé avant l'envoi du formulaire.",
      },
      correction: {
        title: "Corrigez le plateau",
        desktop:
          "Si un bug arrive au milieu d'une partie, vous pouvez corriger le plateau. Contre un bot, ou en pratique locale, la correction s'active sans qu'une personne accepte. Contre un humain, vous la demandez et les deux joueurs ne peuvent modifier qu'après acceptation. Remettez les cartes, puis quittez la correction et continuez.",
        mobile:
          "Si un bug arrive au milieu d'une partie, vous pouvez corriger le plateau depuis cette disposition. Contre un bot, ou en pratique locale, la correction s'active sans qu'une personne accepte. Contre un humain, vous la demandez et les deux joueurs ne peuvent modifier qu'après acceptation. Remettez les cartes, puis quittez la correction et continuez.",
      },
      undo: {
        title: "Annulez une action",
        desktop:
          "Choisissez Undo pour remettre la dernière action. Choisissez Undo turn pour revenir au début du tour en cours. Dans un match classé en direct, l'adversaire doit accepter. Dans les autres matchs, l'annulation s'applique sans demande.",
        mobile:
          "Ouvrez le menu de match et choisissez Undo pour remettre la dernière action. Choisissez Undo turn pour revenir au début du tour en cours. Dans un match classé en direct, l'adversaire doit accepter. Dans les autres matchs, l'annulation s'applique sans demande.",
      },
    },
  },
  de: {
    label: "Dein erstes Spiel",
    invitation:
      "Neu bei Flesh and Blood? Probiere eine kurze geführte Partie, bevor du gegen jemanden spielst.",
    start: "Geführtes Spiel starten",
    done: "Du kannst zur Übung zurückkehren oder die Anleitung jederzeit wieder öffnen.",
    step: (current, total) => `Schritt ${current} von ${total}`,
    back: "Zurück",
    next: "Weiter",
    finish: "Anleitung beenden",
    skip: "Anleitung überspringen",
    replay: "Anleitung für das erste Spiel anzeigen",
    minimize: "Anleitung minimieren",
    restore: "Anleitung öffnen",
    returnToPractice: "Zurück zur Übung",
    steps: {
      cards: {
        title: "Bewege und spiele Karten",
        desktop:
          "Klicke eine Karte auf deiner Hand an, um deine Aktionen zu sehen. Du kannst sie auch auf einen markierten Bereich ziehen. Nur erlaubte Züge funktionieren.",
        mobile:
          "Tippe eine Karte auf deiner Hand an, um deine Aktionen zu sehen. Du kannst sie auch ziehen. Falls Ziehen schwerfällt, nutze die Kartenaktionen.",
      },
      attack: {
        title: "Greife an",
        desktop:
          "Klicke deine Waffe oder eine Attack Action auf der Hand an, wenn du Priorität und einen Action Point hast. Wähle dann den angebotenen Angriff.",
        mobile:
          "Tippe deine Waffe oder eine Attack Action auf der Hand an, wenn du Priorität und einen Action Point hast. Wähle dann den angebotenen Angriff.",
      },
      defend: {
        title: "Verteidige",
        desktop:
          "Wenn ein Angriff auf dich zielt, klicke eine Karte auf der Hand oder ein Ausrüstungsteil an, etwa dein Chest, und deklariere sie als verteidigende Karte.",
        mobile:
          "Wenn ein Angriff auf dich zielt, tippe eine Karte auf der Hand oder deine Chest-Ausrüstung an und deklariere sie als verteidigende Karte.",
      },
      pitch: {
        title: "Pitche zum Bezahlen",
        desktop:
          "Eine Karte zu spielen kostet Ressourcenpunkte. Pitche eine Karte von der Hand in diese Pitch-Zone. Rot gibt 1, Gelb 2 und Blau 3.",
        mobile:
          "Tippe auf diesen Pitch-Stapel. Pitche eine Karte von der Hand für ihren Pitch-Wert: Rot 1, Gelb 2, Blau 3.",
      },
      settings: {
        title: "Passe das Spiel an",
        desktop:
          "Öffne das Menü neben deinem Namen, Open your player actions. Wähle Settings und dann den Tab Game. Dort änderst du Optionen, ohne die Partie zu verlassen.",
        mobile:
          "Tippe unten links auf Open match menu. Öffne Seats, dann das Menü neben deinem Namen, wähle Settings und den Tab Game.",
      },
      report: {
        title: "Melde einen Spieler",
        desktop:
          "Öffne im Live-Spiel das Menü in diesem Gegnerbereich und wähle Report player. Der Gegner hier ist ein Beispiel. Erst mit dem Absenden wird etwas gemeldet.",
        mobile:
          "Das ist die Gegnerübersicht. Tippe im Live-Spiel auf Open match menu, öffne Seats und wähle Report player. Erst mit dem Absenden wird etwas gemeldet.",
      },
      priority: {
        title: "Behalte Priorität",
        desktop:
          "Wähle Hold next priority window neben deinem Namen, um dein nächstes Prioritätsfenster offen zu halten, statt zu passen. Passe, wenn du bereit bist.",
        mobile:
          "Tippe auf Open match menu, öffne Seats und wähle Hold next priority window neben deinem Namen, um dein nächstes Prioritätsfenster offen zu halten.",
      },
      bug: {
        title: "Das Spiel kann fehlschlagen",
        desktop:
          "Das Spiel kann fehlschlagen. Öffne das Menü neben deinem Namen, Open your player actions, und wähle Report bug, damit wir es reparieren können. Melde einen Fehler immer, wenn etwas kaputtgeht. Das ist getrennt von Report player. Erst mit dem Absenden wird etwas gesendet.",
        mobile:
          "Das Spiel kann fehlschlagen. Tippe unten links auf Open match menu, öffne Seats, dann das Menü neben deinem Namen, und wähle Report bug, damit wir es reparieren können. Melde einen Fehler immer, wenn etwas kaputtgeht. Das ist getrennt von Report player. Erst mit dem Absenden wird etwas gesendet.",
      },
      correction: {
        title: "Korrigiere das Spielfeld",
        desktop:
          "Wenn ein Fehler mitten in der Partie passiert, kannst du das Spielfeld korrigieren. Gegen einen Bot oder in lokaler Übung schaltet sich die Korrektur ein, ohne dass eine Person akzeptiert. Gegen einen Menschen beantragst du sie, und beide können erst nach der Annahme ändern. Setze die Karten zurück, verlasse dann die Korrektur und spiele weiter.",
        mobile:
          "Wenn ein Fehler mitten in der Partie passiert, kannst du das Spielfeld von diesem Layout aus korrigieren. Gegen einen Bot oder in lokaler Übung schaltet sich die Korrektur ein, ohne dass eine Person akzeptiert. Gegen einen Menschen beantragst du sie, und beide können erst nach der Annahme ändern. Setze die Karten zurück, verlasse dann die Korrektur und spiele weiter.",
      },
      undo: {
        title: "Mache eine Aktion rückgängig",
        desktop:
          "Wähle Undo, um die letzte Aktion zurückzusetzen. Wähle Undo turn, um zum Anfang des aktuellen Zuges zurückzukehren. In einem gewerteten Live-Match muss der Gegner annehmen. In anderen Matches gilt die Rücknahme ohne Nachfrage.",
        mobile:
          "Öffne das Match-Menü und wähle Undo, um die letzte Aktion zurückzusetzen. Wähle Undo turn, um zum Anfang des aktuellen Zuges zurückzukehren. In einem gewerteten Live-Match muss der Gegner annehmen. In anderen Matches gilt die Rücknahme ohne Nachfrage.",
      },
    },
  },
  es: {
    label: "Tu primera partida",
    invitation:
      "¿Empiezas en Flesh and Blood? Prueba una partida guiada antes de jugar contra alguien.",
    start: "Probar la partida guiada",
    done: "Puedes volver a la práctica o abrir la guía otra vez cuando quieras.",
    step: (current, total) => `Paso ${current} de ${total}`,
    back: "Atrás",
    next: "Siguiente",
    finish: "Terminar guía",
    skip: "Omitir guía",
    replay: "Ver la guía de la primera partida",
    minimize: "Minimizar guía",
    restore: "Abrir guía",
    returnToPractice: "Volver a la práctica",
    steps: {
      cards: {
        title: "Mueve y juega cartas",
        desktop:
          "Haz clic en una carta de tu mano para ver tus acciones. También puedes arrastrarla a una zona resaltada. Solo funcionan las jugadas permitidas.",
        mobile:
          "Toca una carta de tu mano para ver tus acciones. También puedes arrastrarla. Si arrastrar es difícil, usa las acciones de la carta.",
      },
      attack: {
        title: "Ataca",
        desktop:
          "Haz clic en tu arma, o en una attack action de tu mano, cuando tengas prioridad y un action point. Después elige el ataque que ofrece la carta.",
        mobile:
          "Toca tu arma, o una attack action de tu mano, cuando tengas prioridad y un action point. Después elige el ataque que ofrece la carta.",
      },
      defend: {
        title: "Defiende",
        desktop:
          "Cuando un ataque te apunte, haz clic en una carta de tu mano o en un equipo, como tu chest, y declárala como carta defensora.",
        mobile:
          "Cuando un ataque te apunte, toca una carta de tu mano o tu equipo chest y declárala como carta defensora.",
      },
      pitch: {
        title: "Pitchea para pagar",
        desktop:
          "Jugar una carta gasta puntos de recurso. Pitchea una carta de tu mano a esta zona Pitch. Rojo da 1, amarillo 2 y azul 3.",
        mobile:
          "Toca esta pila Pitch. Pitchea una carta de tu mano por su valor: rojo 1, amarillo 2 y azul 3.",
      },
      settings: {
        title: "Ajusta la partida",
        desktop:
          "Abre el menú junto a tu nombre, Open your player actions. Elige Settings y luego la pestaña Game. Puedes cambiar opciones sin salir de la partida.",
        mobile:
          "Toca Open match menu abajo a la izquierda. Abre Seats, luego el menú junto a tu nombre, elige Settings y la pestaña Game.",
      },
      report: {
        title: "Denuncia a un jugador",
        desktop:
          "En una partida en vivo, abre el menú de esta zona del oponente y elige Report player. Este oponente de práctica es un ejemplo. No se envía nada hasta el formulario.",
        mobile:
          "Este es el resumen del oponente. En una partida en vivo, toca Open match menu, abre Seats y elige Report player. No se envía nada hasta el formulario.",
      },
      priority: {
        title: "Conserva la prioridad",
        desktop:
          "Pulsa Hold next priority window junto a tu nombre para mantener abierta tu siguiente ventana de prioridad en lugar de pasar. Pasa cuando estés listo.",
        mobile:
          "Toca Open match menu, abre Seats y pulsa Hold next priority window junto a tu nombre para mantener tu siguiente ventana de prioridad.",
      },
      bug: {
        title: "La partida puede fallar",
        desktop:
          "La partida puede fallar. Abre el menú junto a tu nombre, Open your player actions, y elige Report bug para que podamos corregirlo. Envía siempre un informe cuando algo se rompa. Esto es distinto de Report player. No se envía nada hasta que envíes el formulario.",
        mobile:
          "La partida puede fallar. Toca Open match menu abajo a la izquierda, abre Seats, luego el menú junto a tu nombre, y elige Report bug para que podamos corregirlo. Envía siempre un informe cuando algo se rompa. Esto es distinto de Report player. No se envía nada hasta que envíes el formulario.",
      },
      correction: {
        title: "Corrige el tablero",
        desktop:
          "Si un fallo ocurre en medio de la partida, puedes corregir el tablero. Contra un bot, o en la práctica local, la corrección se activa sin que una persona acepte. Contra un humano, la solicitas y ambos pueden editar solo después de que se acepte. Coloca las cartas, luego deja la corrección y sigue jugando.",
        mobile:
          "Si un fallo ocurre en medio de la partida, puedes corregir el tablero desde esta disposición. Contra un bot, o en la práctica local, la corrección se activa sin que una persona acepte. Contra un humano, la solicitas y ambos pueden editar solo después de que se acepte. Coloca las cartas, luego deja la corrección y sigue jugando.",
      },
      undo: {
        title: "Deshaz una acción",
        desktop:
          "Elige Undo para devolver la última acción. Elige Undo turn para volver al inicio del turno actual. En una partida clasificatoria en vivo, el rival debe aceptar. En las demás partidas, deshacer se aplica sin preguntar.",
        mobile:
          "Abre el menú de la partida y elige Undo para devolver la última acción. Elige Undo turn para volver al inicio del turno actual. En una partida clasificatoria en vivo, el rival debe aceptar. En las demás partidas, deshacer se aplica sin preguntar.",
      },
    },
  },
  it: {
    label: "La tua prima partita",
    invitation:
      "È la tua prima partita di Flesh and Blood? Prova una breve partita guidata prima di giocare con qualcuno.",
    start: "Prova la partita guidata",
    done: "Puoi tornare alla pratica o riaprire la guida quando vuoi.",
    step: (current, total) => `Passo ${current} di ${total}`,
    back: "Indietro",
    next: "Avanti",
    finish: "Termina la guida",
    skip: "Salta la guida",
    replay: "Mostra la guida della prima partita",
    minimize: "Riduci la guida",
    restore: "Apri la guida",
    returnToPractice: "Torna alla pratica",
    steps: {
      cards: {
        title: "Muovi e gioca le carte",
        desktop:
          "Fai clic su una carta nella tua mano per vedere le azioni. Puoi anche trascinarla in un’area evidenziata. Funzionano solo le mosse consentite.",
        mobile:
          "Tocca una carta nella tua mano per vedere le azioni. Puoi anche trascinarla. Se trascinare è difficile, usa le azioni della carta.",
      },
      attack: {
        title: "Attacca",
        desktop:
          "Fai clic sulla tua arma, o su una attack action in mano, quando hai priorità e un action point. Poi scegli l’attacco offerto dalla carta.",
        mobile:
          "Tocca la tua arma, o una attack action in mano, quando hai priorità e un action point. Poi scegli l’attacco offerto dalla carta.",
      },
      defend: {
        title: "Difendi",
        desktop:
          "Quando un attacco ti prende di mira, fai clic su una carta in mano o su un equipaggiamento, come il chest, e dichiaralo carta difendente.",
        mobile:
          "Quando un attacco ti prende di mira, tocca una carta in mano o l’equipaggiamento chest e dichiaralo carta difendente.",
      },
      pitch: {
        title: "Pitcha per pagare",
        desktop:
          "Giocare una carta spende punti risorsa. Pitcha una carta dalla mano in questa zona Pitch. Rosso vale 1, giallo 2 e blu 3.",
        mobile:
          "Tocca questa pila Pitch. Pitcha una carta dalla mano per il suo valore: rosso 1, giallo 2 e blu 3.",
      },
      settings: {
        title: "Cambia le impostazioni",
        desktop:
          "Apri il menu accanto al tuo nome, Open your player actions. Scegli Settings, poi la scheda Game. Puoi cambiare le opzioni senza uscire dalla partita.",
        mobile:
          "Tocca Open match menu in basso a sinistra. Apri Seats, poi il menu accanto al tuo nome, scegli Settings e la scheda Game.",
      },
      report: {
        title: "Segnala un giocatore",
        desktop:
          "In una partita dal vivo, apri il menu in quest’area dell’avversario e scegli Report player. L’avversario di questa pratica è un esempio. Nulla viene inviato finché non invii il modulo.",
        mobile:
          "Questo è il riepilogo dell’avversario. In una partita dal vivo, tocca Open match menu, apri Seats e scegli Report player. Nulla viene inviato finché non invii il modulo.",
      },
      priority: {
        title: "Tieni la priorità",
        desktop:
          "Seleziona Hold next priority window accanto al tuo nome per tenere aperta la prossima finestra di priorità invece di passare. Passa quando sei pronto.",
        mobile:
          "Tocca Open match menu, apri Seats e seleziona Hold next priority window accanto al tuo nome per tenere la prossima finestra di priorità.",
      },
      bug: {
        title: "La partita può fallire",
        desktop:
          "La partita può fallire. Apri il menu accanto al tuo nome, Open your player actions, e scegli Report bug così possiamo correggerlo. Invia sempre una segnalazione quando qualcosa si rompe. È separato da Report player. Nulla viene inviato finché non invii il modulo.",
        mobile:
          "La partita può fallire. Tocca Open match menu in basso a sinistra, apri Seats, poi il menu accanto al tuo nome, e scegli Report bug così possiamo correggerlo. Invia sempre una segnalazione quando qualcosa si rompe. È separato da Report player. Nulla viene inviato finché non invii il modulo.",
      },
      correction: {
        title: "Correggi il tavolo",
        desktop:
          "Se un bug arriva a metà partita, puoi correggere il tavolo. Contro un bot, o in pratica locale, la correzione si attiva senza che una persona accetti. Contro un umano, la chiedi ed entrambi potete modificare solo dopo l'accettazione. Sistema le carte, poi lascia la correzione e continua.",
        mobile:
          "Se un bug arriva a metà partita, puoi correggere il tavolo da questa disposizione. Contro un bot, o in pratica locale, la correzione si attiva senza che una persona accetti. Contro un umano, la chiedi ed entrambi potete modificare solo dopo l'accettazione. Sistema le carte, poi lascia la correzione e continua.",
      },
      undo: {
        title: "Annulla un'azione",
        desktop:
          "Scegli Undo per rimettere l'ultima azione. Scegli Undo turn per tornare all'inizio del turno attuale. In una partita classificata dal vivo, l'avversario deve accettare. Nelle altre partite, l'annullamento si applica senza chiedere.",
        mobile:
          "Apri il menu della partita e scegli Undo per rimettere l'ultima azione. Scegli Undo turn per tornare all'inizio del turno attuale. In una partita classificata dal vivo, l'avversario deve accettare. Nelle altre partite, l'annullamento si applica senza chiedere.",
      },
    },
  },
  "pt-br": {
    label: "Sua primeira partida",
    invitation:
      "Primeira partida de Flesh and Blood? Experimente uma partida guiada antes de jogar contra alguém.",
    start: "Experimentar a partida guiada",
    done: "Você pode voltar à prática ou abrir o guia de novo quando quiser.",
    step: (current, total) => `Etapa ${current} de ${total}`,
    back: "Voltar",
    next: "Próximo",
    finish: "Concluir guia",
    skip: "Pular guia",
    replay: "Mostrar guia da primeira partida",
    minimize: "Minimizar guia",
    restore: "Abrir guia",
    returnToPractice: "Voltar à prática",
    steps: {
      cards: {
        title: "Mova e jogue cartas",
        desktop:
          "Clique em uma carta da sua mão para ver suas ações. Você também pode arrastá-la para uma área destacada. Só as jogadas permitidas funcionam.",
        mobile:
          "Toque em uma carta da sua mão para ver suas ações. Você também pode arrastá-la. Se arrastar for difícil, use as ações da carta.",
      },
      attack: {
        title: "Ataque",
        desktop:
          "Clique na sua arma, ou em uma attack action na mão, quando tiver prioridade e um action point. Depois escolha o ataque que a carta oferece.",
        mobile:
          "Toque na sua arma, ou em uma attack action na mão, quando tiver prioridade e um action point. Depois escolha o ataque que a carta oferece.",
      },
      defend: {
        title: "Defenda",
        desktop:
          "Quando um ataque mirar em você, clique em uma carta da mão ou em um equipamento, como o chest, e declare-o como carta defensora.",
        mobile:
          "Quando um ataque mirar em você, toque em uma carta da mão ou no equipamento chest e declare-o como carta defensora.",
      },
      pitch: {
        title: "Pitch para pagar",
        desktop:
          "Jogar uma carta gasta pontos de recurso. Faça pitch de uma carta da mão nesta zona Pitch. Vermelho vale 1, amarelo 2 e azul 3.",
        mobile:
          "Toque nesta pilha Pitch. Faça pitch de uma carta da mão pelo valor: vermelho 1, amarelo 2 e azul 3.",
      },
      settings: {
        title: "Ajuste a partida",
        desktop:
          "Abra o menu ao lado do seu nome, Open your player actions. Escolha Settings e depois a aba Game. Você pode mudar opções sem sair da partida.",
        mobile:
          "Toque em Open match menu no canto inferior esquerdo. Abra Seats, depois o menu ao lado do seu nome, escolha Settings e a aba Game.",
      },
      report: {
        title: "Denuncie um jogador",
        desktop:
          "Numa partida ao vivo, abra o menu nesta área do oponente e escolha Report player. O oponente deste treino é um exemplo. Nada é enviado até você enviar o formulário.",
        mobile:
          "Este é o resumo do oponente. Numa partida ao vivo, toque em Open match menu, abra Seats e escolha Report player. Nada é enviado até você enviar o formulário.",
      },
      priority: {
        title: "Mantenha a prioridade",
        desktop:
          "Selecione Hold next priority window ao lado do seu nome para manter a próxima janela de prioridade em vez de passar. Passe quando estiver pronto.",
        mobile:
          "Toque em Open match menu, abra Seats e selecione Hold next priority window ao lado do seu nome para manter a próxima janela de prioridade.",
      },
      bug: {
        title: "A partida pode falhar",
        desktop:
          "A partida pode falhar. Abra o menu ao lado do seu nome, Open your player actions, e escolha Report bug para podermos corrigir. Envie sempre um relato quando algo quebrar. Isso é separado de Report player. Nada é enviado até você enviar o formulário.",
        mobile:
          "A partida pode falhar. Toque em Open match menu no canto inferior esquerdo, abra Seats, depois o menu ao lado do seu nome, e escolha Report bug para podermos corrigir. Envie sempre um relato quando algo quebrar. Isso é separado de Report player. Nada é enviado até você enviar o formulário.",
      },
      correction: {
        title: "Corrija o tabuleiro",
        desktop:
          "Se um bug acontecer no meio da partida, você pode corrigir o tabuleiro. Contra um bot, ou na prática local, a correção liga sem uma pessoa aceitar. Contra um humano, você pede e os dois só podem editar depois que for aceito. Acerte as cartas, depois saia da correção e continue jogando.",
        mobile:
          "Se um bug acontecer no meio da partida, você pode corrigir o tabuleiro neste layout. Contra um bot, ou na prática local, a correção liga sem uma pessoa aceitar. Contra um humano, você pede e os dois só podem editar depois que for aceito. Acerte as cartas, depois saia da correção e continue jogando.",
      },
      undo: {
        title: "Desfaça uma ação",
        desktop:
          "Escolha Undo para devolver a última ação. Escolha Undo turn para voltar ao início do turno atual. Numa partida ranqueada ao vivo, o oponente precisa aceitar. Nas outras partidas, desfazer vale sem pedir.",
        mobile:
          "Abra o menu da partida e escolha Undo para devolver a última ação. Escolha Undo turn para voltar ao início do turno atual. Numa partida ranqueada ao vivo, o oponente precisa aceitar. Nas outras partidas, desfazer vale sem pedir.",
      },
    },
  },
};

export function resolveTutorialLocale(
  preference: string | null,
  browserLanguages: readonly string[],
): TutorialLocale {
  const candidates = [preference, ...browserLanguages];
  for (const candidate of candidates) {
    const normalized = candidate?.toLowerCase();
    if (!normalized) continue;
    if (normalized.startsWith("pt")) return "pt-br";
    const base = normalized.split("-")[0];
    if (base === "en" || base === "fr" || base === "de" || base === "es" || base === "it") {
      return base;
    }
  }
  return "en";
}
