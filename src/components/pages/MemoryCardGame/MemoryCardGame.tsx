import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useRegistBestTime } from "../../../hooks/useRegistBestTime";
import { Timer } from "../../../utils/timer";
import { Card } from "../../ui/Card/Card";
import style from "./MemoryCardGame.module.scss";

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

const GAME_STATUS = {
  START: "start",
  IN_GAME: "in_game",
  END: "end",
} as const;

type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export const MemoryCardGame = () => {
  const [cards, setCards] = useState<Card[]>(initiateCards());
  const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.START);

  const [bestTime, setBestTime] = useState("99:59:59");
  useRegistBestTime(bestTime);

  useEffect(() => {
    setBestTime(localStorage.getItem("bestTime") ?? "99:59:59");
  }, [bestTime]);

  const [isDisable, setIsDisable] = useState(true);

  const timerRef = useRef<Timer | null>(null);

  const clickStartHandler = () => {
    if (timerRef.current === null) {
      timerRef.current = new Timer();
    } else {
      return;
    }
    setGameStatus(GAME_STATUS.IN_GAME);
    setIsDisable(false);
    timerRef.current.start();
  };

  const checkGameEnd = (newCards: Card[]) => {
    const gameIsEnd = newCards.every((card) => {
      return card.isMatched === true;
    })
      ? GAME_STATUS.END
      : GAME_STATUS.IN_GAME;

    if (gameIsEnd === GAME_STATUS.END) {
      setGameStatus(gameIsEnd);
      timerRef.current?.stop();

      setBestTime(timerRef.current?.getFormattedTime() ?? "99:59:59");
    }
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
      <h1>Memory Card</h1>
      <div style={{ display: "flex", height: "60px" }}>
        {gameStatus === GAME_STATUS.START && (
          <button className={style.start_button} onClick={clickStartHandler}>
            START
          </button>
        )}
        <div style={{ marginLeft: "auto" }}>自己ベスト：{bestTime}</div>
      </div>
      {gameStatus === GAME_STATUS.END && (
        <h2>
          Clear！！！ time:{timerRef.current?.getFormattedTime() ?? "--:--:--"}
        </h2>
      )}
      {gameStatus === GAME_STATUS.END && (
        <Confetti
          width={3200}
          height={3200}
          numberOfPieces={200}
          gravity={0.3}
          recycle={false}
        />
      )}
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
