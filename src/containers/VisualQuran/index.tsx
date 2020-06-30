import React, { useState, useEffect, useRef } from "react";
import Video from "../../components/Video/Video";
import { QuranVerse } from "../../components/QuranVerse";
import Controller from "../../components/Controller/Controller";
import Modal from "../../components/UI/Modal/Modal";
import axios from "axios";
import { useTranslations, useRecitations, useChapters } from "../../api";
import { Howl, Howler } from "howler";

interface VisualQuran {
  currentAudio: any;
  intervalID: any;
}

interface Settings {
  repeat: boolean;
  meta: any;
  isRecitationChanged: boolean;
  isTranslationChanged: boolean;
  isChapterChanged: boolean;
  resetPage: boolean;
}

interface Current {
  page: number;
  chapterId: any;
  recitationId: any;
  verseCount: number;
  translationId: any;
  versesCurrentPage: number;
}

interface Background {
  videoURL: string;
  imageURL: string;
}
const QuranVerseComponent = () => {
  return <div>Quran Verse</div>;
};

const QuranAudio = ({ audioRef, apiData, verseCount }: any) => {
  useEffect(() => {}, []);
  if (apiData) {
    return (
      <audio
        className='displayNone'
        ref={audioRef}
        controls
        // key={apiData.verses[this.state.currentVerseCount].audio.url}
      >
        <source src={apiData.verses[verseCount].audio.url} />
      </audio>
    );
  } else return <></>;
};

const INITIAL_SETTINGS: Settings = {
  meta: null,
  repeat: true,
  isRecitationChanged: false,
  isTranslationChanged: false,
  isChapterChanged: false,
  resetPage: false
};

const INITIAL_CURRENT: Current = {
  versesCurrentPage: 0,
  chapterId: null,
  translationId: null,
  recitationId: null,
  page: 1,
  verseCount: 0
};

export const VisualQuran = (props: any) => {
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isChapterChanged, setIsChapterChanged] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [current, setCurrent] = useState<Current>(INITIAL_CURRENT);
  const audioRef = useRef<any>();

  const [{ videoURL, imageURL }, setBackground] = useState<Background>({
    videoURL: "./assets/videos/GrassField.mp4",
    imageURL: "https://i.gyazo.com/4e15ef40738c296574b4500f418df626.png"
  } as Background);

  const { translations } = useTranslations(setIsLoading);
  const { recitations } = useRecitations(setIsLoading);
  const { chapters } = useChapters(setIsLoading);

  const onChangePlay = () => {
    const isComplete =
      current.chapterId && current.recitationId && current.translationId;

    setIsPlaying(!isPlaying);

    getAudio().then(() => {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    });
  };
  const handleNext = (event: any) => {
    const currPage = current.page;
    const currVerse = current.verseCount;

    //NEXT VERSE
    if (apiData && event.keyCode === 39) {
      if (currVerse !== apiData.verses.length - 1) {
        setCurrent({ ...current, verseCount: currVerse + 1 });
      } else if (
        currVerse === apiData.verses.length - 1 &&
        !apiData.meta.next_page &&
        settings.repeat
      ) {
        console.log(!apiData.meta.next_page);
        setCurrent({ ...current, verseCount: 0, page: 1 });
      } else if (
        currVerse === apiData.verses.length - 1 &&
        apiData.meta.next_page
      ) {
        setCurrent({ ...current, page: currPage + 1 });

        console.log(current.page + " current page");
      }
    }

    if (apiData && event.keyCode === 37) {
      if (current.verseCount !== 0) {
        setCurrent({ ...current, verseCount: currVerse - 1 });
      } else if (current.verseCount === 0 && !apiData.meta.prev_page) {
        console.log(!apiData.meta.next_page);
        setCurrent({ ...current, verseCount: 0 });
      } else if (current.verseCount === 0 && apiData.meta.prev_page) {
        setCurrent({ ...current, page: currPage - 1 });

        console.log(current.page + " current page");
      }
    }
  };

  const handlePrev = () => {};
  const onRepeatHandle = () => {};
  const onChangeSettings = () => {};

  const onChangeBackground = (videoURL: string, imageURL: string) => {
    setBackground({ videoURL, imageURL });
  };

  const getAudio = async () => {
    try {
      let response = await axios.get(
        `/chapters/${current.chapterId}/verses?recitation=${
          current.recitationId
        }&translations=${
          current.translationId
        }&language=en&text_type=words&page=${1}`
      );

      setApiData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(translations, recitations, chapters);

    window.addEventListener("keydown", handleNext);

    if (translations && recitations && chapters) {
      setCurrent({
        ...current,
        translationId: translations[13].id,
        recitationId: recitations[0].id,
        chapterId: chapters[0].id
      });
    }
  }, [translations, recitations, chapters]);

  return (
    <>
      <QuranVerse
        params={{
          currentVerse: apiData
            ? apiData.verses[current.verseCount].verse_key
            : "",
          arabicVerse: apiData
            ? apiData.verses[current.verseCount].text_madani
            : "Select any chapters",
          translationVerse: apiData
            ? apiData.verses[current.verseCount].translations[0].text
            : "translation here"
        }}
      />
      <QuranAudio
        audioRef={audioRef}
        apiData={apiData}
        verseCount={current.verseCount}
      />
      <Modal>
        <Controller
          isPlaying={isPlaying}
          onPlay={onChangePlay}
          current={current}
          settings={settings}
          nextChapter={handleNext}
          prevChapter={handlePrev}
          onRepeat={onRepeatHandle}
          onChangeSettings={onChangeSettings}
          imgURL={imageURL}
          onChangeBackground={onChangeBackground}
          chapters={chapters}
          recitations={recitations}
          translations={translations}
        ></Controller>
      </Modal>

      <Video videoURL={videoURL}></Video>
    </>
  );
};
