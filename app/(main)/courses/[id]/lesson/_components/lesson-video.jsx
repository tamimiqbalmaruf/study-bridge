"use client";
import ReactPlayer from "react-player/youtube";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LessonVideo = ({ courseId, lesson, module }) => {
    const router = useRouter();
  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          lessonId: lesson?.id,
          moduleSlug: module,
          state: "started",
          lastTime: 0,
        }),
      });

      if (response.status === 200) {
        const result = await response.text();
        setStarted(false)
      }
    };

    started && updateLessonWatch();
  }, [started, courseId, lesson?.id, module]);

  useEffect(() => {

    async function updateLessonWatch() {
        const response = await fetch("/api/lesson-watch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: courseId,
            lessonId: lesson?.id,
            moduleSlug: module,
            state: "completed",
            lastTime: duration,
          }),
        });
  
        if (response.status === 200) {
          const result = await response.text();
        //   setEnded(true) my login
        setEnded(false) // his logic
          router.refresh();
        }
      };
  
      ended && updateLessonWatch();

  }, [ended, courseId, duration, lesson?.id, module, router]);

  const handleOnStart = () => {
    setStarted(true);
  };

  const handleOnEnded = () => {
    setEnded(true);
  };

  const handleOnDuration = (duration) => {
    setDuration(duration);
  };

  return (
    <>
      {hasWindow && (
        <ReactPlayer
          url={lesson?.video_url}
          width={"100%"}
          height={"470px"}
          controls={true}
          onStart={handleOnStart}
          onEnded={handleOnEnded}
          onDuration={handleOnDuration}
        />
      )}
    </>
  );
};

export default LessonVideo;
