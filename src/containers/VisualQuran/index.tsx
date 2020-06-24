import React, { useState, useEffect } from "react";
import Video from "../../components/Video/Video";
import { QuranVerse } from "../../components/QuranVerse";
import Controller from "../../components/Controller/Controller";
import Modal from "../../components/UI/Modal/Modal";
import axios from "axios";
import { useTranslations, useRecitations, useChapters } from "../../api";

interface VisualQuran {
  currentAudio: any;
  intervalID: any;
}

const QuranVerseComponent = () => {
  return <div>Quran Verse</div>;
};

const QuranAudio = () => {
  return <audio></audio>;
};

interface Settings {
  repeat: boolean;
  versesCurrentPage: number;
  currentPage: number;
  currentChapterId: any;
  currentVerseCount: number;
  currentTranslationId: any;
  meta: any;
  isRecitationChanged: boolean;
  isTranslationChanged: boolean;
  isChapterChanged: boolean;
  resetPage: boolean;
  play: boolean;
}

const INITIAL_SETTINGS: Settings = {
  versesCurrentPage: 0,
  currentChapterId: null,
  currentTranslationId: null,
  currentPage: 1,
  currentVerseCount: 0,
  meta: null,
  repeat: true,
  isRecitationChanged: false,
  isTranslationChanged: false,
  isChapterChanged: false,
  resetPage: false,
  play: true
};

interface Background {
  videoURL: string;
  imageURL: string;
}

export const VisualQuran = (props: any) => {
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentVerse, setCurrentVerse] = useState<number>(0);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [{ videoURL, imageURL }, setBackground] = useState<Background>({
    videoURL: "./assets/videos/GrassField.mp4",
    imageURL: "https://i.gyazo.com/4e15ef40738c296574b4500f418df626.png"
  } as Background);

  const { translations } = useTranslations(setIsLoading);
  const { recitations } = useRecitations(setIsLoading);
  const { chapters } = useChapters(setIsLoading);

  const onChangePlay = () => {};
  const handleNext = () => {};
  const handlePrev = () => {};
  const onRepeatHandle = () => {};
  const onChangeSettings = () => {};
  const onChangeBackground = () => {};

  useEffect(() => {
    console.log(translations, recitations, chapters);
  }, [translations, recitations, chapters]);

  return (
    <>
      <QuranVerse
        params={{ arabicVerse: "Select something", currentVerse: "any" }}
      />
      <QuranAudio />
      <Modal>
        <Controller
          currPlay={settings.play}
          onPlay={onChangePlay}
          currentCheck={settings.repeat}
          currentSettings={settings}
          nextChapter={handleNext}
          prevChapter={handlePrev}
          onRepeat={onRepeatHandle}
          settings={onChangeSettings}
          imgURL={imageURL}
          changeBackground={onChangeBackground}
          chapters={chapters}
          recitations={recitations}
          translations={translations}
        ></Controller>
      </Modal>

      <Video videoURL={videoURL}></Video>
    </>
  );
};
