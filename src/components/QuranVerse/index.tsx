import React, { Component } from "react";
import ".";

import ReactHtmlParser from "react-html-parser";

interface QuranVerseProps {
  params: {
    arabicVerse: any;
    currentVerse?: any;
    ayahSymbol?: any;
    translationVerse?: any;
  };
}

export const QuranVerse = ({ params }: QuranVerseProps) => {
  return (
    <>
      <div className='container block'>
        <div key={params.currentVerse} className='arabic fade-in zoomIn block'>
          <h1>
            {params.ayahSymbol} {ReactHtmlParser(params.arabicVerse)}
          </h1>
        </div>
      </div>

      <div key={params.currentVerse} className='translation fade-in zoomIn'>
        <h2>
          {params.currentVerse} {ReactHtmlParser(params.translationVerse)}
        </h2>
      </div>
    </>
  );
};
