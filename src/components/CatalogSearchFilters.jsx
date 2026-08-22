import React, { useState } from 'react';
import { Filter, Palette, Type, Hash, ChevronDown } from 'lucide-react';
import { ColorBar, LetterBar, NumberBar } from './CatalogOptionBar';
import { getColorForLetter } from '../data/shilohCatalog';

const BARS = [
  { id: 'color', label: 'צבע', icon: Palette },
  { id: 'letter', label: 'אות', icon: Type },
  { id: 'number', label: 'מספר', icon: Hash }
];

export default function CatalogSearchFilters({ value, onChange }) {
  const [openBar, setOpenBar] = useState('letter');

  const update = (patch) => {
    const next = { ...value, ...patch };

    if (patch.color !== undefined && patch.color !== value.color) {
      const letterColor = next.letter ? getColorForLetter(next.letter) : '';
      if (next.color && next.letter && letterColor !== next.color) {
        next.letter = '';
        next.number = '';
      }
    }

    if (patch.letter !== undefined && patch.letter !== value.letter) {
      next.number = '';
      if (patch.letter) {
        next.color = getColorForLetter(patch.letter);
      }
    }

    onChange(next);
  };

  const hasFilter = value.color || value.letter || value.number;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center text-lg font-semibold">
          <Filter className="ml-2" size={20} />
          חיפוש לפי קטגוריות
        </h3>
        {hasFilter && (
          <button
            type="button"
            onClick={() => onChange({ color: '', letter: '', number: '' })}
            className="text-sm text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
          >
            נקה סינון
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {BARS.map(({ id, label, icon: Icon }) => {
          const active = openBar === id;
          const chosen =
            id === 'color' ? value.color : id === 'letter' ? value.letter : value.number;
          return (
            <button
              key={id}
              type="button"
              aria-expanded={active}
              onClick={() => setOpenBar(active ? null : id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active || chosen
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Icon size={16} />
              {label}
              {chosen ? <span className="font-normal opacity-90">· {chosen}</span> : null}
              <ChevronDown size={14} className={active ? 'rotate-180' : ''} />
            </button>
          );
        })}
      </div>

      {openBar && (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          {openBar === 'color' && (
            <ColorBar value={value.color} onChange={(color) => update({ color })} />
          )}
          {openBar === 'letter' && (
            <LetterBar
              color=""
              value={value.letter}
              onChange={(letter) => update({ letter })}
            />
          )}
          {openBar === 'number' && (
            <NumberBar
              letter={value.letter}
              value={value.number}
              onChange={(number) => update({ number })}
            />
          )}
        </div>
      )}
    </div>
  );
}
