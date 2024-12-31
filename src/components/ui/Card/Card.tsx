import styles from "./card.module.scss";

type Props = {
  imageName: string;
  isFlipped: boolean;
};

export const Card = (props: Props) => {
  const IMAGE_WIDTH = 160;
  const IMAGE_HEIGHT = 160;

  return (
    <div className={styles.card}>
        {props.isFlipped ?
      <img
        src={`${props.imageName}`}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
      /> : <img
      src={`card.png`}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
      />
        }
    </div>
  );
};
