import React, { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';

export default function TimePicker({
  value = '',
  onChange = () => {},
  placeholder = 'בחר שעה'
}) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    let newValue = e.target.value.replace(/[^\d]/g, '');

    if (newValue.length > 4) {
      newValue = newValue.slice(0, 4);
    }

    if (newValue.length >= 1) {
      const firstHourDigit = parseInt(newValue[0], 10);
      if (firstHourDigit > 2) return;
    }

    if (newValue.length >= 2) {
      const hour = parseInt(newValue.slice(0, 2), 10);
      if (hour > 23) return;
    }

    if (newValue.length >= 3) {
      const firstMinuteDigit = parseInt(newValue[2], 10);
      if (firstMinuteDigit > 5) return;
      newValue = `${newValue.slice(0, 2)}:${newValue.slice(2)}`;
    }

    if (newValue.length === 5) {
      const [, minutesStr] = newValue.split(':');
      const minutes = parseInt(minutesStr, 10);
      if (minutes > 59) return;
    }

    setInputValue(newValue);

    if (newValue.length === 5) {
      const [hoursStr, minutesStr] = newValue.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        onChange(newValue);
      }
    }
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    const isNumber = /^[0-9]$/.test(e.key);

    if (!allowedKeys.includes(e.key) && !isNumber) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    if (inputValue && inputValue.length > 0 && inputValue.length < 5) {
      let correctedValue = inputValue.replace(/[^\d]/g, '');

      while (correctedValue.length < 4) {
        correctedValue += '0';
      }

      const finalValue = `${correctedValue.slice(0, 2)}:${correctedValue.slice(2, 4)}`;
      const [hoursStr, minutesStr] = finalValue.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        setInputValue(finalValue);
        onChange(finalValue);
      } else {
        setInputValue('');
        onChange('');
      }
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full rounded-xl border border-stone-300 pl-10 pr-1 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white hover:border-emerald-400 transition-colors text-right font-normal"
          placeholder={placeholder}
          maxLength={5}
        />

        {inputValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Clock className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-1 text-center">
        הקלד 4 מספרים (למשל: 1430 → 14:30)
      </div>
    </div>
  );
}
