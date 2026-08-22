import React from 'react';
import {
  CATALOG_COLORS,
  getLetters,
  getNumbers,
  formatSubtopicLabel
} from '../data/shilohCatalog';

const chipBase =
  'inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';

export function ColorBar({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="listbox" aria-label="צבע">
      {CATALOG_COLORS.map((color) => {
        const selected = value === color.id;
        return (
          <button
            key={color.id}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onChange(selected ? '' : color.id)}
            className={`${chipBase} ${selected ? color.selected : color.chip}`}
          >
            <span className={`h-3.5 w-3.5 rounded-full border border-black/10 ${color.swatch}`} />
            {color.name}
          </button>
        );
      })}
    </div>
  );
}

export function LetterBar({ color, value, onChange }) {
  const letters = getLetters(color);
  if (letters.length === 0) {
    return <p className="text-sm text-stone-500">אין אותיות בצבע הזה</p>;
  }

  return (
    <div className="flex flex-wrap gap-2" role="listbox" aria-label="אות">
      {letters.map((topic) => {
        const selected = value === topic.letter;
        return (
          <button
            key={topic.letter}
            type="button"
            role="option"
            aria-selected={selected}
            title={topic.name}
            onClick={() => onChange(selected ? '' : topic.letter)}
            className={`${chipBase} ${
              selected
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            <span className="font-semibold">{topic.letter}</span>
            <span className="max-w-[11rem] truncate">{topic.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function NumberBar({ letter, value, onChange }) {
  if (!letter) {
    return <p className="text-sm text-stone-500">בחרו אות כדי לראות את מספרי תת-הנושא</p>;
  }

  const numbers = getNumbers(letter);
  if (numbers.length === 0) {
    return <p className="text-sm text-stone-500">אין מספרים לאות שנבחרה</p>;
  }

  return (
    <div
      className="flex max-h-52 flex-wrap gap-2 overflow-y-auto"
      role="listbox"
      aria-label="מספר"
    >
      {numbers.map((subtopic) => {
        const selected = value === subtopic.number;
        return (
          <button
            key={`${subtopic.number}-${subtopic.name}`}
            type="button"
            role="option"
            aria-selected={selected}
            title={formatSubtopicLabel(subtopic)}
            onClick={() => onChange(selected ? '' : subtopic.number)}
            className={`${chipBase} ${
              selected
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            <span className="font-semibold tabular-nums">{subtopic.number}</span>
            {subtopic.name ? (
              <span className="max-w-[14rem] truncate">{subtopic.name}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
