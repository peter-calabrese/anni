import styles from "./timelinecard.module.css";

interface Event {
  title: string;
  date: string;
  description: string;
  image?: string;
  position: "left" | "right";
}

export default function TimelineCard({
  title,
  date,
  description,
  image,
  position,
}: Event) {
  return (
    <div>
      <div
        className={`${styles.cardWrapper} ${position === "left" ? styles.cardWrapperLeft : styles.cardWrapperRight}`}
      >
        <img className={styles.mainImage} src={image} alt={title} />
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3>{title}</h3>
            <p>{date}</p>
          </div>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}
