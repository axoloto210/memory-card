import { useState } from "react";
import { Card } from "../../ui/Card/Card";

type InitialCard = Readonly<{
    imageName:string;
    tag: number;
}>

type Card = InitialCard & {
  isOpen: boolean;
  isClear: boolean;
};

const initialCards = [
  { imageName: "woop_org.png", tag: 1 },
  { imageName: "woop_dot_eye.png", tag: 2 },
  { imageName: "woop_dot_eye_sad.png", tag: 3 },
  { imageName: "woop_mouse.png", tag: 4 },
  { imageName: "woop_wink.png", tag: 5 },
  { imageName: "woop_wink_r.png", tag: 6 },
  { imageName: "woop_wink_w.png", tag: 7 },
  { imageName: "woop_sad.png", tag: 8 },
] as const satisfies InitialCard[];

function initiateCards() {
  const duplocatedCards = initialCards
    .flatMap((card) => [card, card]) //duplicate cards
    .map((card) => {
      return {
        ...card,
        isOpen: false,
        isClear: false,
      };
    });
  return shuffle(duplocatedCards);
}

/**
 * Fisher-Yates shuffle
 * 
 * @param array 
 * @returns 
 */ 
function shuffle<T>(array: T[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const MemoryCardGame = () => {
  const [cards, setCards] = useState(initiateCards());

  return (
    <>
      <div>
        <h1>Memory Card Game</h1>
      </div>
      <div className="card_area">
        {cards.map((card) => {
          return <Card cardNumber={card.tag} imageName={card.imageName} />;
        })}
      </div>
    </>
  );
};
