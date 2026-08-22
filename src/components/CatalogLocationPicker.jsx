import React from 'react';
import { ColorBar, LetterBar, NumberBar } from './CatalogOptionBar';
import { getColorForLetter } from '../data/shilohCatalog';

export default function CatalogLocationPicker({ location, onChange, errors = {}, disabled = false }) {
  const update = (patch) => {
    const next = { ...location, ...patch };

    if (patch.color !== undefined && patch.color !== location.color) {
      const letterColor = next.letter ? getColorForLetter(next.letter) : '';
      if (next.color && next.letter && letterColor !== next.color) {
        next.letter = '';
        next.number = '';
      }
    }

    if (patch.letter !== undefined && patch.letter !== location.letter) {
      next.number = '';
      if (patch.letter) {
        next.color = getColorForLetter(patch.letter);
      }
    }

    onChange(next);
  };

  const fieldClass = (hasError) =>
    `rounded-2xl border p-4 ${hasError ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50'} ${
      disabled ? 'pointer-events-none opacity-50' : ''
    }`;

  return (
    <div className="space-y-4">
      <div className={fieldClass(errors.locationColor)}>
        <p className="mb-3 text-right text-sm font-medium">צבע</p>
        <ColorBar value={location?.color || ''} onChange={(color) => update({ color })} />
        {errors.locationColor && <p className="mt-2 text-xs text-red-600">{errors.locationColor}</p>}
      </div>

      <div className={fieldClass(errors.locationLetter)}>
        <p className="mb-3 text-right text-sm font-medium">אות</p>
        <LetterBar
          color={location?.color || ''}
          value={location?.letter || ''}
          onChange={(letter) => update({ letter })}
        />
        {errors.locationLetter && <p className="mt-2 text-xs text-red-600">{errors.locationLetter}</p>}
      </div>

      <div className={fieldClass(errors.locationNumber)}>
        <p className="mb-3 text-right text-sm font-medium">מספר</p>
        <NumberBar
          letter={location?.letter || ''}
          value={location?.number || ''}
          onChange={(number) => update({ number })}
        />
        {errors.locationNumber && <p className="mt-2 text-xs text-red-600">{errors.locationNumber}</p>}
      </div>
    </div>
  );
}
