import React, { useEffect, useState } from "react";
import axios from "axios";

const useQuranApi = (props: any) => {
  const { settings, currentPage, changedChapter, currentAudio } = props;
  const [data, setData] = useState<any>();

  useEffect(() => {
    axios
      .get(
        `/chapters/${settings.currentChapterId}/verses?recitation=${
          settings.currentRecitationId
        }&translations=${
          settings.currentTranslationId
        }&language=en&text_type=words&page=${changedChapter ? 1 : currentPage}`
      )
      .then((response: any) => {
        setData({
          apiData: response.data,
          currentVerseCount: 0,
          changedRecitation: false,
          changedTranslation: false,
          changedChapter: false,
          resetPage: true
        });

        console.log(response.data.verses[0].audio.url);

        currentAudio.current.pause();
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props]);
};

const useRecitations = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [recitations, setRecitations] = useState<any>();

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("/options/recitations")
      .then((response) => {
        const docs = response.data.recitations;
        const allRecitations = docs.map((recitator: any) => ({
          ...recitator,
          imgURL: `assets/images/reciters/${recitator.id}.jpg`
        }));

        setRecitations(allRecitations);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    return () => {};
  }, []);

  return {
    recitations
  };
};

const useTranslations = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [translations, setTranslations] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/options/translations")
      .then((response) => {
        const initialTranslations = response.data.translations.sort(
          (a: any, b: any) => {
            if (a.language_name < b.language_name) return -1;
            if (a.language_name > b.language_name) return 1;
            return 0;
          }
        );
        setTranslations(initialTranslations);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }, []);

  return {
    translations
  };
};

const useChapters = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [chapters, setChapters] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/chapters")
      .then((response) => {
        const initialChapters = response.data.chapters;
        setChapters(initialChapters);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  return {
    chapters
  };
};

export { useRecitations, useChapters, useTranslations };
