import { useState } from "react";
import { Card } from "../../ui/Card/Card";

type InitialCard = Readonly<{
  imageName: string;
  tag: number;
}>;

type Card = InitialCard & {
  cardId: number;
  isFlipped: boolean;
  isMatched: boolean;
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
    .flatMap((card) => [
      { ...card, cardId: 2 * card.tag - 1 },
      { ...card, cardId: 2 * card.tag },
    ]) //duplicate cards
    .map((card) => {
      return {
        ...card,
        isFlipped: false,
        isMatched: false,
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
  const [cards, setCards] = useState<Card[]>(initiateCards());
  const [isGameEnd, setIsGameEnd] = useState(false);

  const [isDisable, setIsDisable] = useState(false);

  const checkGameEnd = (newCards: Card[]) => {
    setIsGameEnd(
      newCards.every((card) => {
        return card.isMatched === true;
      })
    );
  };

  const flippedCardTag = () => {
    return cards.find((card) => {
      return card.isFlipped === true && card.isMatched === false;
    })?.tag;
  };

  const clickCardHandler = (clickedCard: Card) => {
    if (clickedCard.isFlipped) {
      return;
    }
    setIsDisable(true);

    const flippedTag = flippedCardTag();

    const isFirstFlip = flippedTag === undefined;

    const newCards: Card[] = cards.map((card) => {
      return clickedCard.cardId === card.cardId
        ? {
            ...card,
            isFlipped: true,
          }
        : card;
    });

    if (!isFirstFlip) {
      if (clickedCard.tag === flippedTag) {
        const matchedCards = newCards.map((card) => {
          return card.tag === flippedTag
            ? {
                ...card,
                isMatched: true,
              }
            : card;
        });
        setCards(matchedCards);
        setIsDisable(false);

        setTimeout(() => {
          checkGameEnd(matchedCards);
        }, 500);
      } else {
        setCards(newCards);
        // when flipped cards are two, reset flipped status.
        setTimeout(() => {
          setCards(
            newCards.map((card) => {
              return card.tag === flippedTag ||
                card.cardId === clickedCard.cardId
                ? {
                    ...card,
                    isFlipped: false,
                  }
                : card;
            })
          );
          setIsDisable(false);
        }, 1000);
      }
    } else {
      setCards(newCards);
      setIsDisable(false);
    }
  };

  return (
    <>
      <div>
        <h1>Memory Card</h1>
      </div>
      {isGameEnd && <h2>Clear！！！</h2>}
      <div className="card_area">
        {cards.map((card) => {
          return (
            <button
              key={card.cardId}
              onClick={() => clickCardHandler(card)}
              disabled={isDisable}
            >
              <Card imageName={card.imageName} isFlipped={card.isFlipped} />
            </button>
          );
        })}
      </div>
    </>
  );
};
