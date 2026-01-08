import { useEffect, useState } from "react";
import styles from "./timelinecard.module.css";
import { apiClient } from "../../lib/api";

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
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    apiClient(`images/presigned-url/${image}`).then((res) =>
      res.json().then((data) => setImageUrl(data.url)),
    );
  }, [image]);

  return (
    <div
      className={`${styles.cardWrapper} ${position === "left" ? styles.cardWrapperLeft : styles.cardWrapperRight}`}
    >
      <img className={styles.mainImage} src={imageUrl} alt={title} />

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3>{title}</h3>
          <p>
            {new Date(date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}
