import TimelineCard from "./components/TimelineCard";
import "./App.css";
export default function App() {
  return (
    <div className="timelineContainer">
      {[
        Array.from({ length: 21 }).map((_, index) => (
          <TimelineCard
            key={index}
            position={index % 2 === 0 ? "left" : "right"}
            title="Christmas Tree"
            date="2026-01-01"
            description="Looking at our tree, toasting to the new year"
            image="src\assets\iamge.png"
          />
        )),
      ]}
    </div>
  );
}
