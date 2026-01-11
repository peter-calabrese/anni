import "./Timeline.css";
import TimelineCard from "../../../components/TimelineCard";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/api";
import { AudioPlayer } from "../../../components/AudioPlayer";
import audio from "../../../assets/our_song.mp3";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/timeline/")({
  component: Timeline,
});
interface Image {
  imageTaken: string;
  imageUrl: string;
}

interface Metadata {
  title: string;
  description: string;
  image: Image;
}

function Timeline() {
  const [data, setData] = useState<Metadata[]>([]);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      const response = await apiClient("images");
      setData(await response.json());
    };
    fetchImages();
  }, []);
  return (
    <div className="container">
      <button className="logout-button" style={{
        position: "absolute",
        top: 8,
        right: 8,

      }} onClick={signOut}>Logout</button>
      <AudioPlayer audioSrc={audio} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1>Happy Anniversary Precious</h1>
        <p className="timelineMessage">
          I wanted to create a timeline of our time together over the last year,
          enjoy this trip down memory lane. I love you more than words can
          express. ❤️♾️
        </p>
      </div>
      <div className="timelineContainer">
        {[
          data?.map(
            (
              { description, image: { imageUrl, imageTaken }, title },
              index,
            ) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TimelineCard
                  position={index % 2 === 0 ? "left" : "right"}
                  title={title}
                  date={imageTaken}
                  description={description}
                  image={imageUrl}
                />
              </div>
            ),
          ),
        ]}
      </div>
    </div>
  );
}
