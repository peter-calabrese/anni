import { useEffect, useRef, useState, type DragEventHandler } from "react"
import { motion } from "motion/react"
import image from "../../assets/iamge.png"
export function AudioPlayer({ audioSrc }: { audioSrc: any }) {

    interface DragConstraints {
        left: number,
        top: number,
        right: number,
        bottom: number
    }
    const [isPlaying, setIsPlaying] = useState<Boolean>(false);
    const audioRef = useRef(null);

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const BOX_WIDTH = 250;
    const BOX_HEIGHT = 50;

    const [constraints, setConstraints] = useState<DragConstraints | null>(null);

    useEffect(() => {
        const updateConstraints = () => {
            setConstraints({
                left: 0,
                top: 0,
                right: window.innerWidth - BOX_WIDTH,
                bottom: window.innerHeight - BOX_HEIGHT,
            });
        };

        updateConstraints();
        window.addEventListener("resize", updateConstraints);
        return () => window.removeEventListener("resize", updateConstraints);
    }, []);

    if (!constraints) return null;


    return (

        <motion.div
            drag
            dragMomentum={true}
            dragElastic={0.12}
            dragConstraints={constraints}
            style={{
                width: BOX_WIDTH,
                height: BOX_HEIGHT,
                background: "#6366f1",
                borderRadius: 12,
                zIndex: 9999,
                position: "fixed",
                top: 0,
                left: 0,
                cursor: "grab",
            }}
        >
            <img src={image} width={48} height={48} draggable="false" />
            <audio
                ref={audioRef}
                src={audioSrc}
                onPlay={handlePlay}
                onPause={handlePause}
                loop

            />
            <button style={{
                position: "absolute",
                right: 0
            }}>X</button>
            <button >
                {isPlaying ? "Pause" : "Play"}
            </button>


        </motion.div >

    )
}