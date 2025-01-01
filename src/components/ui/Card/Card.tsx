import style from "./Card.module.scss";

type Props = {
  imageName: string;
  isFlipped: boolean;
};

export const Card = (props: Props) => {
    
  return (
    <div className={style.card}>
        {props.isFlipped ?
      <img
        src={`${props.imageName}`}
        className={style.card_image}
      /> : <img
      src={`card.png`}
        className={style.card_image}
      />
        }
    </div>
  );
};
