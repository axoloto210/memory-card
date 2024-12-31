import styles from "./card.module.scss"


type Props = {
    cardNumber: number
    imageName: string,
}

export const Card = (props: Props) => {

    const CARD_WIDTH = 160
    const CARD_HEIGHT = 160

    return (
        <div className={styles.card}><img src={`public/${props.imageName}`} width={CARD_WIDTH} height={CARD_HEIGHT}></img></div>
    )
}