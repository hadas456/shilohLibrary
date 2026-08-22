// קטלוג ישיבת שילה — צבע, אות ומספר לפי קובץ הקטלוג.
// בחירת מיקום ספר נעשית מהרשימות האלה בלבד.

export const CATALOG_COLORS = [
  {
    id: 'תכלת',
    name: 'תכלת',
    swatch: 'bg-cyan-400',
    selected: 'bg-cyan-500 text-white border-cyan-600',
    chip: 'border-cyan-300 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
  },
  {
    id: 'אדום',
    name: 'אדום',
    swatch: 'bg-red-500',
    selected: 'bg-red-600 text-white border-red-700',
    chip: 'border-red-200 bg-red-50 text-red-900 hover:bg-red-100'
  },
  {
    id: 'ירוק',
    name: 'ירוק',
    swatch: 'bg-green-600',
    selected: 'bg-green-700 text-white border-green-800',
    chip: 'border-green-200 bg-green-50 text-green-900 hover:bg-green-100'
  },
  {
    id: 'צהוב',
    name: 'צהוב',
    swatch: 'bg-yellow-400',
    selected: 'bg-yellow-400 text-stone-900 border-yellow-500',
    chip: 'border-yellow-300 bg-yellow-50 text-yellow-900 hover:bg-yellow-100'
  },
  {
    id: 'כתום',
    name: 'כתום',
    swatch: 'bg-orange-400',
    selected: 'bg-orange-500 text-white border-orange-600',
    chip: 'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100'
  }
];

export const CATALOG_TOPICS = [
  {
    "letter": "א",
    "name": "תורה",
    "color": "תכלת",
    "subtopics": [
      {
        "number": "1",
        "name": "תנכ\"ים ותורה בלי פירושים"
      },
      {
        "number": "2",
        "name": "תיקון סופרים + תאג'"
      },
      {
        "number": "3",
        "name": "חק לישראל + תורה עם פירוש מלבי\"ם(קטן)"
      },
      {
        "number": "4",
        "name": "מקראות גדולות"
      },
      {
        "number": "5",
        "name": "תורת חיים"
      },
      {
        "number": "6",
        "name": "מבואות לתורה, מסורה וטעמי המקרא"
      },
      {
        "number": "7",
        "name": "העמק דבר"
      },
      {
        "number": "8",
        "name": "חומשים מפורשים"
      },
      {
        "number": "9",
        "name": "חומשים מפורשים"
      },
      {
        "number": "10",
        "name": "גאונים עה\"ת"
      },
      {
        "number": "11-13",
        "name": "רש\"י ומפרשיו"
      },
      {
        "number": "14-18",
        "name": "ראשונים עה\"ת"
      },
      {
        "number": "20-21",
        "name": "א"
      },
      {
        "number": "22-23",
        "name": "ב"
      },
      {
        "number": "24-25",
        "name": "ג"
      },
      {
        "number": "26-27",
        "name": "ד"
      },
      {
        "number": "28-29",
        "name": "ה"
      },
      {
        "number": "30-31",
        "name": "ו"
      },
      {
        "number": "32-33",
        "name": "ז"
      },
      {
        "number": "34-35",
        "name": "ח"
      },
      {
        "number": "36-37",
        "name": "ט"
      },
      {
        "number": "38-39",
        "name": "י"
      },
      {
        "number": "40-41",
        "name": "כ"
      },
      {
        "number": "42-43",
        "name": "ל"
      },
      {
        "number": "44-45",
        "name": "מ"
      },
      {
        "number": "46-47",
        "name": "נ"
      },
      {
        "number": "48-49",
        "name": "ס"
      },
      {
        "number": "50-51",
        "name": "ע"
      },
      {
        "number": "52-53",
        "name": "פ"
      },
      {
        "number": "54-55",
        "name": "צ"
      },
      {
        "number": "56",
        "name": "ק"
      },
      {
        "number": "57",
        "name": "ר"
      },
      {
        "number": "58-59",
        "name": "ש"
      },
      {
        "number": "60",
        "name": "תורה שלמה"
      },
      {
        "number": "61-62",
        "name": "ת"
      },
      {
        "number": "69-71",
        "name": "ליקוטי פירושים) מעם לועז, וכו ('"
      },
      {
        "number": "72",
        "name": "אחרונים עה\"ת בספרים גבוהים"
      },
      {
        "number": "80",
        "name": "מחקרים בפרשני התנ\"ך"
      }
    ]
  },
  {
    "letter": "ב",
    "name": "נביאים וכתובים",
    "color": "תכלת",
    "subtopics": [
      {
        "number": "1",
        "name": "נ\"ך ללא פירושים"
      },
      {
        "number": "2",
        "name": "נ\"ך מפורש ומקראות גדולות"
      },
      {
        "number": "3-4",
        "name": "דעת מקרא"
      },
      {
        "number": "10",
        "name": "דעת סופרים"
      },
      {
        "number": "15",
        "name": "פירושים נ\"ך כללי"
      },
      {
        "number": "20",
        "name": "פרשנות נביאים"
      },
      {
        "number": "21",
        "name": "יהושע שופטים"
      },
      {
        "number": "22",
        "name": "שמואל"
      },
      {
        "number": "23",
        "name": "מלכים"
      },
      {
        "number": "24",
        "name": "ישעיה"
      },
      {
        "number": "25",
        "name": "ירמיה"
      },
      {
        "number": "26",
        "name": "יחזקאל"
      },
      {
        "number": "27",
        "name": "תרי עשר"
      },
      {
        "number": "28",
        "name": "הפטרות"
      },
      {
        "number": "30",
        "name": "כתובים ופרשנותם"
      },
      {
        "number": "31",
        "name": "תהילים"
      },
      {
        "number": "32",
        "name": "משלי"
      },
      {
        "number": "33",
        "name": "איוב"
      },
      {
        "number": "34",
        "name": "דניאל"
      },
      {
        "number": "35",
        "name": "עזרא ונחמיה"
      },
      {
        "number": "36",
        "name": "דברי הימים"
      },
      {
        "number": "40",
        "name": "מגילות כללי"
      },
      {
        "number": "41",
        "name": "רות"
      },
      {
        "number": "42",
        "name": "שיר השירים"
      },
      {
        "number": "43",
        "name": "קהלת"
      },
      {
        "number": "44",
        "name": "איכה"
      },
      {
        "number": "45",
        "name": "אסתר"
      },
      {
        "number": "60",
        "name": "ספרי עזר כלליים"
      },
      {
        "number": "70",
        "name": "כתובים אחרונים וכד'"
      },
      {
        "number": "80",
        "name": "מחקרי תנ\"ך"
      },
      {
        "number": "90",
        "name": "ילקוטי פירושים נ\"ך - כללי"
      }
    ]
  },
  {
    "letter": "ג",
    "name": "מדרשים",
    "color": "תכלת",
    "subtopics": [
      {
        "number": "11",
        "name": "מכילתא"
      },
      {
        "number": "12",
        "name": "ספרא, תורת כהנים"
      },
      {
        "number": "13",
        "name": "ספרי"
      },
      {
        "number": "14",
        "name": "פסיקתא"
      },
      {
        "number": "20",
        "name": "מדרש רבה"
      },
      {
        "number": "22",
        "name": "מדרש רבה המבואר"
      },
      {
        "number": "23",
        "name": "מדרש רבה - יבנה"
      },
      {
        "number": "24",
        "name": "בראשית רבה - מהדורה מדעית"
      },
      {
        "number": "25",
        "name": "מדרש רבה - מהדורה מדעית"
      },
      {
        "number": "40-41",
        "name": "אגדה כללית"
      },
      {
        "number": "42",
        "name": "מדרש תנחומא"
      },
      {
        "number": "44",
        "name": "ילמדנו : אגדת בראשית"
      },
      {
        "number": "45",
        "name": "ילמדנו : מדרש חדש, ספר ילקוטים) גרינהוט ("
      },
      {
        "number": "46",
        "name": "פרקי דרבי אליעזר"
      },
      {
        "number": "51",
        "name": "תנא דבי אליהו"
      },
      {
        "number": "52",
        "name": "ילקוט שמעוני"
      },
      {
        "number": "53",
        "name": "ילקוט שמעוני - מוסד הרב קוק"
      },
      {
        "number": "54",
        "name": "מדרש תנחומא"
      },
      {
        "number": "55",
        "name": "מדרש הראובני"
      },
      {
        "number": "57",
        "name": "סדר עולם"
      },
      {
        "number": "59",
        "name": "פרקי דרבי אליעזר"
      },
      {
        "number": "60",
        "name": "מדרש אגדה - כללי"
      },
      {
        "number": "62",
        "name": "מדרש הגדול"
      },
      {
        "number": "63",
        "name": "מדרש החפץ"
      },
      {
        "number": "65",
        "name": "מדרשים על התנ\"ך"
      },
      {
        "number": "67-69",
        "name": "ליקוטי אגדות"
      },
      {
        "number": "70-71",
        "name": "ספרי עזר לאגדות ומפרשים"
      },
      {
        "number": "72-75",
        "name": "אינציקלופדיות לאגדות ומדרשים"
      },
      {
        "number": "80",
        "name": "עין יעקב"
      },
      {
        "number": "82",
        "name": "פירושים על אגדות התלמוד"
      }
    ]
  },
  {
    "letter": "ד",
    "name": "משניות, גמרא, תלמוד ירושלמי ובבלי, וראשונים על הש\"ס",
    "color": "אדום",
    "subtopics": [
      {
        "number": "1-2",
        "name": "משניות כללי - סטים"
      },
      {
        "number": "3-4",
        "name": "פירושים מסכת אבות"
      },
      {
        "number": "5",
        "name": "משניות עם פירושים"
      },
      {
        "number": "6-7",
        "name": "משניות קהתי, שטיינזלץ"
      },
      {
        "number": "8-9",
        "name": "מחקרים ומבואות לתלמוד, תוספתא"
      },
      {
        "number": "10-11",
        "name": "תלמוד ירושלמי"
      },
      {
        "number": "12-15",
        "name": "מפרשים על הירושלמי"
      },
      {
        "number": "19-24",
        "name": "תלמוד בבלי - סטים"
      },
      {
        "number": "25-26",
        "name": "שטיינזלץ שוטנשטיין ומתיבתא על הגמרא"
      },
      {
        "number": "30",
        "name": "גאונים"
      },
      {
        "number": "31",
        "name": "רבנו חננאל"
      },
      {
        "number": "35-36",
        "name": "שיטה מקובצת"
      },
      {
        "number": "37",
        "name": "תוס'ראש"
      },
      {
        "number": "39-40",
        "name": "תוס'ריד"
      },
      {
        "number": "41-42",
        "name": "תוס'ראשונים ותוס'פרץ"
      },
      {
        "number": "46",
        "name": "ראשונים על הריף"
      },
      {
        "number": "50-51",
        "name": "רמב\"ן על הש\"ס"
      },
      {
        "number": "53",
        "name": "ריטב\"א"
      },
      {
        "number": "55",
        "name": "רשב\"א"
      },
      {
        "number": "61-62",
        "name": "הר\"ן"
      },
      {
        "number": "63-65",
        "name": "המאירי"
      },
      {
        "number": "70-74",
        "name": "ראשונים נוספים - סטים"
      }
    ]
  },
  {
    "letter": "ה",
    "name": "אחרונים על הש\"ס",
    "color": "אדום",
    "subtopics": [
      {
        "number": "1",
        "name": "א"
      },
      {
        "number": "2",
        "name": "ב - ג"
      },
      {
        "number": "3",
        "name": "ד"
      },
      {
        "number": "4",
        "name": "ה"
      },
      {
        "number": "5",
        "name": "ו - ז"
      },
      {
        "number": "5-6",
        "name": "ח"
      },
      {
        "number": "7",
        "name": "ט - י"
      },
      {
        "number": "8-9",
        "name": "כ - מ"
      },
      {
        "number": "10-11",
        "name": "נ"
      },
      {
        "number": "12",
        "name": "ס"
      },
      {
        "number": "13",
        "name": "ע"
      },
      {
        "number": "14",
        "name": "פ - צ"
      },
      {
        "number": "15",
        "name": "ק"
      },
      {
        "number": "16",
        "name": "ר"
      },
      {
        "number": "17-18",
        "name": "ש"
      },
      {
        "number": "19",
        "name": "ת"
      },
      {
        "number": "20",
        "name": "זרעים כללי"
      },
      {
        "number": "21-22",
        "name": "ברכות"
      },
      {
        "number": "23",
        "name": "שאר זרעים"
      },
      {
        "number": "24-25",
        "name": "מועד כללי"
      },
      {
        "number": "26-27",
        "name": "שבת"
      },
      {
        "number": "29",
        "name": "ערובין"
      },
      {
        "number": "30-31",
        "name": "פסחים שקלים"
      },
      {
        "number": "32-33",
        "name": "ראש השנה יומא"
      },
      {
        "number": "34-35",
        "name": "סוכה ביצה"
      },
      {
        "number": "36",
        "name": "תענית מגילה"
      },
      {
        "number": "37",
        "name": "מועד קטן חגיגה"
      },
      {
        "number": "38-39",
        "name": "נשים כללי"
      },
      {
        "number": "40",
        "name": "יבמות"
      },
      {
        "number": "41-42",
        "name": "כתובות"
      },
      {
        "number": "43",
        "name": "נדרים"
      },
      {
        "number": "44",
        "name": "נזיר"
      },
      {
        "number": "45",
        "name": "סוטה"
      },
      {
        "number": "46-47",
        "name": "גיטין"
      },
      {
        "number": "48-49",
        "name": "קידושין"
      },
      {
        "number": "50-52",
        "name": "נזיקין כללי"
      },
      {
        "number": "53-54",
        "name": "בבא קמא"
      },
      {
        "number": "55-56",
        "name": "בבא מציעא"
      },
      {
        "number": "57-58",
        "name": "בבא בתרא"
      },
      {
        "number": "59-60",
        "name": "סנהדרין"
      },
      {
        "number": "61",
        "name": "מכות"
      },
      {
        "number": "62",
        "name": "שבועות"
      },
      {
        "number": "63",
        "name": "עבודה זרה עדויות"
      },
      {
        "number": "64",
        "name": "הוריות"
      },
      {
        "number": "65-66",
        "name": "קדשים כללי"
      },
      {
        "number": "67-68",
        "name": "זבחים"
      },
      {
        "number": "69",
        "name": "מנחות"
      },
      {
        "number": "70-71",
        "name": "חולין"
      },
      {
        "number": "72",
        "name": "בכורות"
      },
      {
        "number": "73",
        "name": "ערכין"
      },
      {
        "number": "74",
        "name": "תמורה"
      },
      {
        "number": "75",
        "name": "כריתות"
      },
      {
        "number": "76",
        "name": "מעילה קינין"
      },
      {
        "number": "77",
        "name": "תמיד מידות"
      },
      {
        "number": "78-80",
        "name": "טהרות כללי"
      },
      {
        "number": "81",
        "name": "נדה"
      },
      {
        "number": "82-83",
        "name": "סוגיות בש\"ס"
      },
      {
        "number": "88",
        "name": "הדרנים"
      },
      {
        "number": "92-97",
        "name": "ליקוטי מפרשים"
      }
    ]
  },
  {
    "letter": "ו",
    "name": "שיעורים, ספרי מצוות, גאונים וראשונים בהלכה",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "10-19",
        "name": "מידות ושיעורים"
      },
      {
        "number": "20-25",
        "name": "ספרי מצוות"
      },
      {
        "number": "26-27",
        "name": "ספר החינוך ומפרשיו"
      },
      {
        "number": "28-29",
        "name": "אנצקלופדיות ספרי מצוות"
      },
      {
        "number": "30-39",
        "name": "גאונים בהלכה"
      },
      {
        "number": "40-49",
        "name": "ראשונים בהלכה"
      }
    ]
  },
  {
    "letter": "ז",
    "name": "משנה תורה להרמב\"ם ונושאי כליו",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "10",
        "name": "משנה תורה"
      },
      {
        "number": "12-13",
        "name": "משנה תורה - הרב קאפח"
      },
      {
        "number": "14-15",
        "name": "משנה תורה - פרנקל"
      },
      {
        "number": "16",
        "name": "משנה תורה - רמב\"ם לעם"
      },
      {
        "number": "18",
        "name": "עוז והדר"
      },
      {
        "number": "20",
        "name": "מחקרים ומבואות"
      },
      {
        "number": "30-31",
        "name": "א"
      },
      {
        "number": "32",
        "name": "ב - ג"
      },
      {
        "number": "33",
        "name": "ד"
      },
      {
        "number": "34",
        "name": "ה"
      },
      {
        "number": "35",
        "name": "ו - ז"
      },
      {
        "number": "36",
        "name": "ז"
      },
      {
        "number": "37",
        "name": "ח"
      },
      {
        "number": "38",
        "name": "ט"
      },
      {
        "number": "39",
        "name": "י"
      },
      {
        "number": "40",
        "name": "כ"
      },
      {
        "number": "42",
        "name": "ל"
      },
      {
        "number": "43",
        "name": "מ"
      },
      {
        "number": "44",
        "name": "נ"
      },
      {
        "number": "46",
        "name": "ס"
      },
      {
        "number": "47",
        "name": "ע"
      },
      {
        "number": "48",
        "name": "פ"
      },
      {
        "number": "49",
        "name": "צ"
      },
      {
        "number": "51",
        "name": "ק"
      },
      {
        "number": "52",
        "name": "ר"
      },
      {
        "number": "54",
        "name": "ש"
      },
      {
        "number": "56",
        "name": "ת"
      },
      {
        "number": "60-61",
        "name": "מדע"
      },
      {
        "number": "62-63",
        "name": "אהבה"
      },
      {
        "number": "64-65",
        "name": "זמנים"
      },
      {
        "number": "66-67",
        "name": "נשים"
      },
      {
        "number": "68",
        "name": "קדושה"
      },
      {
        "number": "70",
        "name": "הפלאה"
      },
      {
        "number": "71",
        "name": "זרעים"
      },
      {
        "number": "72",
        "name": "עבודה"
      },
      {
        "number": "73",
        "name": "קרבנות"
      },
      {
        "number": "75",
        "name": "טהרה"
      },
      {
        "number": "76-77",
        "name": "נזיקין"
      },
      {
        "number": "78",
        "name": "קנין"
      },
      {
        "number": "79",
        "name": "משפטים"
      },
      {
        "number": "80",
        "name": "שופטים"
      }
    ]
  },
  {
    "letter": "ח",
    "name": "טור שולחן ערוך וכדו'",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "10-15",
        "name": "טור ומפרשיו"
      },
      {
        "number": "16-18",
        "name": "הטור השלם"
      },
      {
        "number": "25-29",
        "name": "טור השו\"ע"
      },
      {
        "number": "30-39",
        "name": "שולחן ערוך"
      },
      {
        "number": "40",
        "name": "שולחן ערוך לבעל מרכבת המשנה"
      },
      {
        "number": "50-59",
        "name": "ערוך השולחן וערה\"ש העתיד"
      },
      {
        "number": "60-62",
        "name": "שו\"ע הרב"
      },
      {
        "number": "70-80",
        "name": "מפרשי שו\"ע כללי"
      },
      {
        "number": "81-90",
        "name": "הלכות שו\"ע כללי"
      }
    ]
  },
  {
    "letter": "ט",
    "name": "אבן העזר",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "1-8",
        "name": "פרשנים על סדר השולחן ערוך אבה\"ע"
      },
      {
        "number": "9",
        "name": "מפתח לשו\"ת ופוסקים באבה\"ע"
      },
      {
        "number": "10",
        "name": "א"
      },
      {
        "number": "11",
        "name": "ב"
      },
      {
        "number": "12",
        "name": "ג"
      },
      {
        "number": "13",
        "name": "ד"
      },
      {
        "number": "14",
        "name": "ה"
      },
      {
        "number": "15",
        "name": "ו"
      },
      {
        "number": "16",
        "name": "ז"
      },
      {
        "number": "17",
        "name": "ח"
      },
      {
        "number": "18",
        "name": "ט"
      },
      {
        "number": "20",
        "name": "י"
      },
      {
        "number": "21",
        "name": "כ"
      },
      {
        "number": "22",
        "name": "ל"
      },
      {
        "number": "23",
        "name": "מ"
      },
      {
        "number": "24",
        "name": "נ"
      },
      {
        "number": "26",
        "name": "ס"
      },
      {
        "number": "27",
        "name": "ע"
      },
      {
        "number": "28",
        "name": "פ"
      },
      {
        "number": "29",
        "name": "צ"
      },
      {
        "number": "30",
        "name": "ק"
      },
      {
        "number": "31",
        "name": "ר"
      },
      {
        "number": "32",
        "name": "ש"
      },
      {
        "number": "33",
        "name": "ת"
      },
      {
        "number": "32",
        "name": "פריה ורביה ואישות"
      },
      {
        "number": "33",
        "name": "עגונה"
      },
      {
        "number": "34",
        "name": "קידושין"
      },
      {
        "number": "35",
        "name": "כתובות"
      },
      {
        "number": "36",
        "name": "גיטין"
      },
      {
        "number": "37",
        "name": "יבום וחליצה"
      },
      {
        "number": "38",
        "name": "יחוד וצניעות"
      },
      {
        "number": "39",
        "name": "נישואין ומשפחה"
      }
    ]
  },
  {
    "letter": "י",
    "name": "חושן משפט",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "1",
        "name": "א"
      },
      {
        "number": "2",
        "name": "ב - ג"
      },
      {
        "number": "3",
        "name": "ד"
      },
      {
        "number": "4",
        "name": "ה - ו"
      },
      {
        "number": "5",
        "name": "ז - ח"
      },
      {
        "number": "6",
        "name": "ט"
      },
      {
        "number": "7",
        "name": "י - כ"
      },
      {
        "number": "8",
        "name": "ל - מ"
      },
      {
        "number": "9",
        "name": "נ"
      },
      {
        "number": "10",
        "name": "ס"
      },
      {
        "number": "11",
        "name": "ע - פ"
      },
      {
        "number": "12",
        "name": "צ"
      },
      {
        "number": "13",
        "name": "ק"
      },
      {
        "number": "14",
        "name": "ר"
      },
      {
        "number": "15",
        "name": "ש - ת"
      },
      {
        "number": "16",
        "name": "א"
      },
      {
        "number": "17",
        "name": "ב - ג"
      },
      {
        "number": "18",
        "name": "ד"
      },
      {
        "number": "19",
        "name": "ה - ו"
      },
      {
        "number": "20",
        "name": "ז"
      },
      {
        "number": "21",
        "name": "ח"
      },
      {
        "number": "22",
        "name": "ט - י"
      },
      {
        "number": "23",
        "name": "כ"
      },
      {
        "number": "24",
        "name": "ל - מ"
      },
      {
        "number": "25",
        "name": "נ - ס"
      },
      {
        "number": "26",
        "name": "ע - פ"
      },
      {
        "number": "27",
        "name": "צ - ק - ר"
      },
      {
        "number": "28",
        "name": "ש - ת"
      },
      {
        "number": "30-32",
        "name": "חזקה"
      },
      {
        "number": "33-34",
        "name": "גביית חובות"
      },
      {
        "number": "35-39",
        "name": "הלוואה"
      },
      {
        "number": "40-44",
        "name": "אפוטרופוסות"
      },
      {
        "number": "45-49",
        "name": "ירושה"
      },
      {
        "number": "50-54",
        "name": "עדות"
      },
      {
        "number": "55-59",
        "name": "דיינים"
      },
      {
        "number": "60-64",
        "name": "מקח וממכר - פקדון - קנין"
      },
      {
        "number": "65-69",
        "name": "אבידה ומציאה"
      },
      {
        "number": "70-79",
        "name": "שמיטת כספים"
      },
      {
        "number": "80-84",
        "name": "נזקי ממון"
      },
      {
        "number": "85-86",
        "name": "שותפים - שכנים"
      },
      {
        "number": "87",
        "name": "גניבה - גזילה"
      },
      {
        "number": "90-92",
        "name": "מחקרים במשפט העברי"
      },
      {
        "number": "93",
        "name": "משפט עברי - רעיון ומוסר"
      }
    ]
  },
  {
    "letter": "כ",
    "name": "יורה דעה",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "1",
        "name": "א"
      },
      {
        "number": "2",
        "name": "ב"
      },
      {
        "number": "3",
        "name": "ג"
      },
      {
        "number": "4",
        "name": "ד - ה"
      },
      {
        "number": "5",
        "name": "ו - ז"
      },
      {
        "number": "6",
        "name": "ח - ט"
      },
      {
        "number": "7",
        "name": "י"
      },
      {
        "number": "8",
        "name": "כ"
      },
      {
        "number": "9",
        "name": "ל - מ"
      },
      {
        "number": "10",
        "name": "נ - ס"
      },
      {
        "number": "11",
        "name": "ע - פ"
      },
      {
        "number": "12",
        "name": "צ - ק"
      },
      {
        "number": "13",
        "name": "ר"
      },
      {
        "number": "14",
        "name": "ש - ת"
      },
      {
        "number": "15",
        "name": "א"
      },
      {
        "number": "16",
        "name": "ב"
      },
      {
        "number": "17",
        "name": "ג"
      },
      {
        "number": "18",
        "name": "ד - ה"
      },
      {
        "number": "19",
        "name": "ו - ז"
      },
      {
        "number": "20",
        "name": "ח - ט"
      },
      {
        "number": "21",
        "name": "י"
      },
      {
        "number": "22",
        "name": "כ"
      },
      {
        "number": "23",
        "name": "ל - מ"
      },
      {
        "number": "24",
        "name": "נ - ס"
      },
      {
        "number": "25",
        "name": "ע - פ"
      },
      {
        "number": "26",
        "name": "צ - ק"
      },
      {
        "number": "27",
        "name": "ר"
      },
      {
        "number": "28",
        "name": "ש - ת"
      },
      {
        "number": "30-37",
        "name": "שחיטה וטריפות"
      },
      {
        "number": "38",
        "name": "מתנות כהונה"
      },
      {
        "number": "39",
        "name": "בין אדם לחברו לשון הרע"
      },
      {
        "number": "40-44",
        "name": "איסור והיתר"
      },
      {
        "number": "45-47",
        "name": "טבילת כלים הכשרת כלים"
      },
      {
        "number": "48",
        "name": "גילוח"
      },
      {
        "number": "49",
        "name": "עבודה זרה, יין נסך וכדו'"
      },
      {
        "number": "50-54",
        "name": "נידה וטבילה"
      },
      {
        "number": "55-59",
        "name": "מקוואות"
      },
      {
        "number": "60-64",
        "name": "נדרים שבועות"
      },
      {
        "number": "65-69",
        "name": "סת\"ם"
      },
      {
        "number": "70-72",
        "name": "שמחות - אבילות"
      },
      {
        "number": "73-74",
        "name": "כלאיים שעטנז"
      },
      {
        "number": "75-77",
        "name": "תלמוד תורה"
      },
      {
        "number": "78-79",
        "name": "כיבוד הורים"
      },
      {
        "number": "80-84",
        "name": "צדקה ביקור חולים"
      },
      {
        "number": "85-89",
        "name": "מילה"
      },
      {
        "number": "90-91",
        "name": "גרים"
      },
      {
        "number": "92-93",
        "name": "חלה"
      },
      {
        "number": "94-95",
        "name": "מעשר כספים"
      },
      {
        "number": "96-97",
        "name": "הלכות ריבית"
      }
    ]
  },
  {
    "letter": "ל",
    "name": "אורח חיים",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "1",
        "name": "א"
      },
      {
        "number": "2",
        "name": "ב"
      },
      {
        "number": "3",
        "name": "ג"
      },
      {
        "number": "4",
        "name": "ד"
      },
      {
        "number": "5",
        "name": "ה - ו"
      },
      {
        "number": "6",
        "name": "ז - ח"
      },
      {
        "number": "7",
        "name": "ט"
      },
      {
        "number": "8",
        "name": "י"
      },
      {
        "number": "9",
        "name": "כ"
      },
      {
        "number": "10",
        "name": "ל"
      },
      {
        "number": "11",
        "name": "מ - נ"
      },
      {
        "number": "12",
        "name": "ס - ע"
      },
      {
        "number": "14",
        "name": "פ - צ"
      },
      {
        "number": "15",
        "name": "ק"
      },
      {
        "number": "16",
        "name": "ר"
      },
      {
        "number": "17",
        "name": "ש"
      },
      {
        "number": "18",
        "name": "ת"
      },
      {
        "number": "20",
        "name": "א - ב"
      },
      {
        "number": "21",
        "name": "ג - ד"
      },
      {
        "number": "22",
        "name": "ה - ו"
      },
      {
        "number": "23",
        "name": "ז - ח"
      },
      {
        "number": "24",
        "name": "ט - י - כ"
      },
      {
        "number": "25",
        "name": "ל - מ"
      },
      {
        "number": "26",
        "name": "נ - ס"
      },
      {
        "number": "27",
        "name": "ע - פ"
      },
      {
        "number": "28",
        "name": "צ - ק"
      },
      {
        "number": "29",
        "name": "ר - ש - ת"
      },
      {
        "number": "30-34",
        "name": "ציצית ותפילין"
      },
      {
        "number": "35-39",
        "name": "קריאת שמע ותפילה"
      },
      {
        "number": "40-43",
        "name": "קריאת התורה"
      },
      {
        "number": "44-45",
        "name": "בית הכנסת"
      },
      {
        "number": "46-49",
        "name": "נטילת ידים וברכות"
      },
      {
        "number": "50-55",
        "name": "שבת"
      },
      {
        "number": "56-57",
        "name": "ערובין"
      },
      {
        "number": "58-59",
        "name": "ראש חודש"
      },
      {
        "number": "60-69",
        "name": "מועדים וזמנים כללי"
      },
      {
        "number": "70-74",
        "name": "פסח ועומר"
      },
      {
        "number": "75-79",
        "name": "תענית ובין המצרים"
      },
      {
        "number": "80-84",
        "name": "ימים נוראים"
      },
      {
        "number": "85-89",
        "name": "סוכות - שמחת תורה"
      },
      {
        "number": "90-94",
        "name": "חנוכה פורים וט\"ו בשבט"
      },
      {
        "number": "95-96",
        "name": "יו\"ט ויו\"ט שני של גלויות"
      }
    ]
  },
  {
    "letter": "מ",
    "name": "הלכה",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "10-19",
        "name": "חיקרי הלכה"
      },
      {
        "number": "40-49",
        "name": "הלכות נשים"
      },
      {
        "number": "50-59",
        "name": "מנהגים"
      },
      {
        "number": "60-69",
        "name": "קיצורי הלכות) קיצוש\"ע וכו ('"
      },
      {
        "number": "70-79",
        "name": "הלכה ורפואה"
      },
      {
        "number": "80-89",
        "name": "הלכות טכנולוגיות"
      },
      {
        "number": "90-95",
        "name": "שונות"
      },
      {
        "number": "96-97",
        "name": "קבצים הלכתיים"
      },
      {
        "number": "98",
        "name": "כתבי עת בהלכה"
      }
    ]
  },
  {
    "letter": "נ",
    "name": "שו\"ת",
    "color": "ירוק",
    "subtopics": [
      {
        "number": "1-9",
        "name": "גאונים"
      },
      {
        "number": "11",
        "name": "א - ב"
      },
      {
        "number": "12",
        "name": "ג - ד - ה"
      },
      {
        "number": "13",
        "name": "ה - ו"
      },
      {
        "number": "14",
        "name": "ז - ח"
      },
      {
        "number": "15",
        "name": "ח"
      },
      {
        "number": "16",
        "name": "ט - י"
      },
      {
        "number": "17",
        "name": "כ - ל"
      },
      {
        "number": "18",
        "name": "מ - נ"
      },
      {
        "number": "19",
        "name": "ס - ע"
      },
      {
        "number": "20",
        "name": "פ - צ"
      },
      {
        "number": "21",
        "name": "ק - ר"
      },
      {
        "number": "22",
        "name": "ש - ת"
      },
      {
        "number": "23-24",
        "name": "אחרונים א"
      },
      {
        "number": "25-27",
        "name": "ב"
      },
      {
        "number": "28",
        "name": "ג"
      },
      {
        "number": "29-30",
        "name": "ד"
      },
      {
        "number": "31-32",
        "name": "ה"
      },
      {
        "number": "33-34",
        "name": "ו"
      },
      {
        "number": "35",
        "name": "ז"
      },
      {
        "number": "36-39",
        "name": "ח"
      },
      {
        "number": "41",
        "name": "ט"
      },
      {
        "number": "42-43",
        "name": "י"
      },
      {
        "number": "44-45",
        "name": "כ"
      },
      {
        "number": "46-47",
        "name": "ל"
      },
      {
        "number": "48-50",
        "name": "מ"
      },
      {
        "number": "51-52",
        "name": "נ"
      },
      {
        "number": "53-54",
        "name": "ס"
      },
      {
        "number": "55",
        "name": "ע"
      },
      {
        "number": "56-57",
        "name": "פ"
      },
      {
        "number": "58-59",
        "name": "צ"
      },
      {
        "number": "61-62",
        "name": "ק"
      },
      {
        "number": "63-64",
        "name": "ר"
      },
      {
        "number": "65-66",
        "name": "ש"
      },
      {
        "number": "67-69",
        "name": "ת"
      },
      {
        "number": "70",
        "name": "א"
      },
      {
        "number": "71",
        "name": "ב"
      },
      {
        "number": "72",
        "name": "ג"
      },
      {
        "number": "73",
        "name": "ד"
      },
      {
        "number": "74",
        "name": "ה"
      },
      {
        "number": "75",
        "name": "ו - ז"
      },
      {
        "number": "76",
        "name": "ח"
      },
      {
        "number": "78",
        "name": "ט"
      },
      {
        "number": "79-80",
        "name": "י"
      },
      {
        "number": "81",
        "name": "כ - ל"
      },
      {
        "number": "82",
        "name": "מ"
      },
      {
        "number": "83",
        "name": "נ"
      },
      {
        "number": "84",
        "name": "ס"
      },
      {
        "number": "85",
        "name": "ע"
      },
      {
        "number": "86",
        "name": "פ"
      },
      {
        "number": "87",
        "name": "צ"
      },
      {
        "number": "88",
        "name": "ק"
      },
      {
        "number": "89",
        "name": "ר"
      },
      {
        "number": "90",
        "name": "ש"
      },
      {
        "number": "92",
        "name": "ת"
      }
    ]
  },
  {
    "letter": "ס",
    "name": "ארץ ישראל",
    "color": "צהוב",
    "subtopics": [
      {
        "number": "1-10",
        "name": "מדעי א\"י וטיולים"
      },
      {
        "number": "20-29",
        "name": "תורת א\"י כללי) גיאוגרפיה גבולות הסטוריה וכד ('"
      },
      {
        "number": "30-39",
        "name": "מדינת ישראל וצה\"ל - רעיונית"
      },
      {
        "number": "40-49",
        "name": "ירושלים מקדש כהונה ומלכות"
      },
      {
        "number": "50-59",
        "name": "מצוות התלויות בארץ"
      },
      {
        "number": "60-69",
        "name": "שמיטה"
      },
      {
        "number": "70-79",
        "name": "אנציקלופדיות ואטלסים על א\"י"
      },
      {
        "number": "80-89",
        "name": "צה\"ל ומדינת ישראל הלכתית ] או מעורב עם רעיונות ["
      },
      {
        "number": "90-92",
        "name": "יום העצמאות יום ירושלים"
      }
    ]
  },
  {
    "letter": "צ",
    "name": "תפילה חסידות וקבלה",
    "color": "צהוב",
    "subtopics": [
      {
        "number": "1-5",
        "name": "ספרים על התפילה"
      },
      {
        "number": "8",
        "name": "א"
      },
      {
        "number": "9",
        "name": "ב - ג"
      },
      {
        "number": "10",
        "name": "ד"
      },
      {
        "number": "12-13",
        "name": "ה"
      },
      {
        "number": "14",
        "name": "ו"
      },
      {
        "number": "15",
        "name": "ז"
      },
      {
        "number": "16",
        "name": "ח"
      },
      {
        "number": "17",
        "name": "ט - י"
      },
      {
        "number": "18",
        "name": "כ - ל"
      },
      {
        "number": "19",
        "name": "מ - נ"
      },
      {
        "number": "21",
        "name": "ס - ע"
      },
      {
        "number": "22",
        "name": "פ - צ"
      },
      {
        "number": "24",
        "name": "ק - ר"
      },
      {
        "number": "25",
        "name": "ש - ת"
      },
      {
        "number": "26-29",
        "name": "הגדות"
      },
      {
        "number": "30-32",
        "name": "מחזורים לימים נוראים ולמועדים"
      },
      {
        "number": "33-39",
        "name": "זמירות סליחות קינות פיוטים אזכרות ברכות וכו'"
      },
      {
        "number": "40-44",
        "name": "תולדות החסידות"
      },
      {
        "number": "50-55",
        "name": "תורת החסידות הכללי"
      },
      {
        "number": "56",
        "name": "בעש\"ט ותלמידיו"
      },
      {
        "number": "57",
        "name": "ראשוני החסידות"
      },
      {
        "number": "58",
        "name": "סלונים"
      },
      {
        "number": "59",
        "name": "חסידות מבוארת"
      },
      {
        "number": "60",
        "name": "תניא ומפרשיו"
      },
      {
        "number": "61-64",
        "name": "חב\"ד"
      },
      {
        "number": "65-66",
        "name": "סיפורי חסידים"
      },
      {
        "number": "67-68",
        "name": "ספרי ברסלב וליקוטי הלכות) ברסלב ("
      },
      {
        "number": "70-75",
        "name": "זוהר ומפרשיו"
      },
      {
        "number": "80-85",
        "name": "כתבי הארי וספרים עליו"
      },
      {
        "number": "85-88",
        "name": "כתבי רבי חיים ויטל וספרים עליו"
      },
      {
        "number": "89-93",
        "name": "ספרי קבלה נוספים"
      }
    ]
  },
  {
    "letter": "ק",
    "name": "מחשבה ומוסר",
    "color": "צהוב",
    "subtopics": [
      {
        "number": "1-5",
        "name": "ראשונים כללי"
      },
      {
        "number": "12-14",
        "name": "רס\"ג כוזרי רמב\"ן"
      },
      {
        "number": "15-19",
        "name": "רמב\"ם"
      },
      {
        "number": "20-23",
        "name": "מהר\"ל"
      },
      {
        "number": "24-26",
        "name": "רמח\"ל"
      },
      {
        "number": "27-28",
        "name": "ר'צדוק"
      },
      {
        "number": "29-31",
        "name": "רשר הירש"
      },
      {
        "number": "32-34",
        "name": "הרב סולוביצ'יק"
      },
      {
        "number": "35-40",
        "name": "הרב קוק"
      },
      {
        "number": "41-45",
        "name": "תורת הרב קוק וכתבי תלמידיו"
      },
      {
        "number": "46",
        "name": "חיים פאלאג'י"
      },
      {
        "number": "47",
        "name": "החיד\"א"
      },
      {
        "number": "48",
        "name": "אחרונים כללי"
      },
      {
        "number": "49",
        "name": "אחרונים כללי"
      },
      {
        "number": "51-53",
        "name": "נושאים כלליים במחשבה"
      },
      {
        "number": "54",
        "name": "ענייני שידוכין ומשפחה"
      },
      {
        "number": "55-57",
        "name": "מוסר ועבודת ה'"
      },
      {
        "number": "58-60",
        "name": "אמונה"
      },
      {
        "number": "61-63",
        "name": "תשובה"
      },
      {
        "number": "64-66",
        "name": "תורה שבכתב ושבעל פה"
      },
      {
        "number": "67-69",
        "name": "משיח וגאולה"
      },
      {
        "number": "70-72",
        "name": "עם ישראל וא\"י"
      },
      {
        "number": "73-75",
        "name": "ציונות דתית"
      },
      {
        "number": "76-78",
        "name": "תורה ומדע"
      },
      {
        "number": "79-81",
        "name": "לימוד תורה"
      },
      {
        "number": "82-83",
        "name": "נבואה"
      },
      {
        "number": "84-85",
        "name": "קידוש ה'והשארת הנפש"
      },
      {
        "number": "86-87",
        "name": "מצוות כללי"
      },
      {
        "number": "88-90",
        "name": "חינוך"
      },
      {
        "number": "91-94",
        "name": "מועדים"
      },
      {
        "number": "95-97",
        "name": "דרושים כללי"
      },
      {
        "number": "98-99",
        "name": "מפתחות לספרי המחשבה"
      }
    ]
  },
  {
    "letter": "ר",
    "name": "ספרי זכרון היסטוריה ועברית",
    "color": "כתום",
    "subtopics": [
      {
        "number": "10-19",
        "name": "כלל תקופתי"
      },
      {
        "number": "20-24",
        "name": "תקופת המקרא הכללי"
      },
      {
        "number": "25-29",
        "name": "תקופת המקרא אישים"
      },
      {
        "number": "30-34",
        "name": "תקופת המשנה והתלמוד כללי"
      },
      {
        "number": "35-39",
        "name": "תקופת המשנה והתלמוד אישים"
      },
      {
        "number": "40-44",
        "name": "תקופת גאונים וראשונים כללי"
      },
      {
        "number": "45-46",
        "name": "תקופת גאונים וראשונים אישים"
      },
      {
        "number": "47-49",
        "name": "ימי הביניים"
      },
      {
        "number": "50-53",
        "name": "תולדות קהילות עדות המזרח וצפון אפריקה"
      },
      {
        "number": "55-56",
        "name": "תולדות קהילות אשכנז"
      },
      {
        "number": "57-59",
        "name": "השואה"
      },
      {
        "number": "60-64",
        "name": "תולדות רבנים מקבצים"
      },
      {
        "number": "65-67",
        "name": "תולדות רבנים בודדים"
      },
      {
        "number": "68-69",
        "name": "העת החדשה"
      },
      {
        "number": "70-77",
        "name": "ספרי זכרון ויובל"
      },
      {
        "number": "78-84",
        "name": "ילקוטי כתבים של רבנים וקהילות"
      },
      {
        "number": "85-87",
        "name": "ספרי משכילים"
      },
      {
        "number": "90-94",
        "name": "דקדוק הגייה מתמטיקה רפואה וטבע"
      },
      {
        "number": "95-97",
        "name": "שירה וספרות"
      }
    ]
  },
  {
    "letter": "ש",
    "name": "מילונים אנציקלופדיות וספרי עזר",
    "color": "כתום",
    "subtopics": [
      {
        "number": "10-13",
        "name": "כללי ש\"ס ופוסקים"
      },
      {
        "number": "14-15",
        "name": "ספר הערוך"
      },
      {
        "number": "16",
        "name": "שדי חמד"
      },
      {
        "number": "18-19",
        "name": "ביבלוגרפיות וספרות תורנית"
      },
      {
        "number": "15-29",
        "name": "אנציקלופדיות"
      },
      {
        "number": "30-39",
        "name": "מפתחות לתנ\"ך"
      },
      {
        "number": "40-49",
        "name": "מפתחות לש\"ס לשו\"ת ולהלכה"
      },
      {
        "number": "50-59",
        "name": "מילונים וקונקורדנציות"
      },
      {
        "number": "60-69",
        "name": "ספרי עזר לרש\"י"
      },
      {
        "number": "70-79",
        "name": "גימאטריות"
      }
    ]
  },
  {
    "letter": "ת",
    "name": "כתבי עת",
    "color": "כתום",
    "subtopics": [
      {
        "number": "1",
        "name": "בת קול, דגל ירושלים"
      },
      {
        "number": "2",
        "name": ""
      },
      {
        "number": "3",
        "name": ""
      },
      {
        "number": "4",
        "name": ""
      },
      {
        "number": "5",
        "name": ""
      },
      {
        "number": "6",
        "name": "ניב המדרשיה"
      },
      {
        "number": "7",
        "name": "בין החומות, עלי חבר, עם התורה קובץ תורני"
      },
      {
        "number": "8",
        "name": ""
      },
      {
        "number": "9",
        "name": ""
      },
      {
        "number": "10",
        "name": "אורות עציון, בדרך אפרת, בלכתך בדרך"
      },
      {
        "number": "11",
        "name": "אסופות, גוונים, מרחבים"
      },
      {
        "number": "12",
        "name": ""
      },
      {
        "number": "13",
        "name": ""
      },
      {
        "number": "14",
        "name": "כתלנו"
      },
      {
        "number": "15",
        "name": "ביכורים, מכרמי שומרון, ממעין מחולה, מספרא, לסייפא, מעלי עשור, מעליות משלב"
      },
      {
        "number": "16",
        "name": ""
      },
      {
        "number": "17",
        "name": "באהלי ימית, ספר היובל, עולה מן המדבר, עלון שבות, עלוני ממרא, עלי מעלות, עלי עלי"
      },
      {
        "number": "18",
        "name": "קול ברמה, קול מהיכל, קטורת שילה"
      },
      {
        "number": "19",
        "name": "שיח בשדה, שיר למעלות, שעלי דעת"
      },
      {
        "number": "20",
        "name": "אהליך יעקב, אמרי יושר, אקדמות"
      },
      {
        "number": "21",
        "name": "גלת"
      },
      {
        "number": "22",
        "name": "ברקאי, האהל, זכור לאברהם"
      },
      {
        "number": "23",
        "name": "פרי עץ הגן"
      },
      {
        "number": "24",
        "name": ""
      },
      {
        "number": "25",
        "name": "מאבני המקום, מבי מדרשה"
      },
      {
        "number": "26",
        "name": "ניצני ארץ"
      },
      {
        "number": "27",
        "name": "עטורי כהנים"
      },
      {
        "number": "28",
        "name": "קובץ בית אהרון וישראל"
      },
      {
        "number": "29",
        "name": ""
      },
      {
        "number": "30",
        "name": ""
      },
      {
        "number": "31",
        "name": ""
      },
      {
        "number": "32",
        "name": ""
      },
      {
        "number": "33",
        "name": ""
      },
      {
        "number": "34",
        "name": "ים התורה"
      },
      {
        "number": "35",
        "name": "מגל, מעייני הישועה"
      },
      {
        "number": "36",
        "name": ""
      },
      {
        "number": "37",
        "name": "עורי צפון"
      },
      {
        "number": "38",
        "name": ""
      },
      {
        "number": "39",
        "name": "שריגים"
      },
      {
        "number": "40",
        "name": "אור המערב"
      },
      {
        "number": "41",
        "name": ""
      },
      {
        "number": "42",
        "name": ""
      },
      {
        "number": "43",
        "name": ""
      },
      {
        "number": "44",
        "name": ""
      },
      {
        "number": "45",
        "name": ""
      },
      {
        "number": "46",
        "name": ""
      },
      {
        "number": "47",
        "name": ""
      },
      {
        "number": "48",
        "name": ""
      },
      {
        "number": "49",
        "name": "שרידים"
      },
      {
        "number": "50",
        "name": ""
      },
      {
        "number": "51",
        "name": ""
      },
      {
        "number": "52",
        "name": "המעין, הסופר"
      },
      {
        "number": "53",
        "name": ""
      },
      {
        "number": "54",
        "name": "המועצה הדתית מטה בנימין, ישע ימינו"
      },
      {
        "number": "55",
        "name": "מוריה"
      },
      {
        "number": "56",
        "name": ""
      },
      {
        "number": "57",
        "name": ""
      },
      {
        "number": "58",
        "name": ""
      },
      {
        "number": "59",
        "name": "הליכות תו שין כף, שנה בשנה"
      },
      {
        "number": "60",
        "name": "אהלי"
      },
      {
        "number": "61",
        "name": ""
      },
      {
        "number": "62",
        "name": ""
      },
      {
        "number": "63",
        "name": ""
      },
      {
        "number": "64",
        "name": "כרם שלמה"
      },
      {
        "number": "65",
        "name": ""
      },
      {
        "number": "66",
        "name": ""
      },
      {
        "number": "67",
        "name": ""
      },
      {
        "number": "68",
        "name": ""
      },
      {
        "number": "69",
        "name": "תחומין"
      },
      {
        "number": "70",
        "name": "אור המזרח"
      },
      {
        "number": "71",
        "name": "גוילין"
      },
      {
        "number": "72",
        "name": ""
      },
      {
        "number": "73",
        "name": ""
      },
      {
        "number": "74",
        "name": "איש על העדה, אמונה דת ומדע, הגות והלכה, יפוצו מעינותיך"
      },
      {
        "number": "75",
        "name": "מורשה"
      },
      {
        "number": "76",
        "name": "סורא"
      },
      {
        "number": "77",
        "name": "פרי הארץ"
      },
      {
        "number": "78",
        "name": ""
      },
      {
        "number": "79",
        "name": "שבילין, שנתון הציונות הדתית"
      },
      {
        "number": "80",
        "name": "ארשת"
      },
      {
        "number": "81",
        "name": ""
      },
      {
        "number": "82",
        "name": ""
      },
      {
        "number": "83",
        "name": ""
      },
      {
        "number": "84",
        "name": ""
      },
      {
        "number": "85",
        "name": ""
      },
      {
        "number": "86",
        "name": "סיני שכה וכו"
      },
      {
        "number": "87",
        "name": ""
      },
      {
        "number": "88",
        "name": ""
      },
      {
        "number": "89",
        "name": "תלפיות"
      },
      {
        "number": "90",
        "name": ""
      },
      {
        "number": "91",
        "name": ""
      },
      {
        "number": "92",
        "name": ""
      },
      {
        "number": "93",
        "name": ""
      },
      {
        "number": "94",
        "name": ""
      },
      {
        "number": "95",
        "name": ""
      },
      {
        "number": "96",
        "name": ""
      },
      {
        "number": "97",
        "name": ""
      },
      {
        "number": "98",
        "name": ""
      },
      {
        "number": "99",
        "name": ""
      },
      {
        "number": "100",
        "name": ""
      }
    ]
  }
];

export const getColorMeta = (colorId) =>
  CATALOG_COLORS.find((c) => c.id === colorId) || null;

export const getLetters = (colorId) => {
  if (!colorId) return CATALOG_TOPICS;
  return CATALOG_TOPICS.filter((t) => t.color === colorId);
};

export const getTopic = (letter) =>
  CATALOG_TOPICS.find((t) => t.letter === letter) || null;

export const getNumbers = (letter) => {
  const topic = getTopic(letter);
  return topic ? topic.subtopics : [];
};



export const getColorForLetter = (letter) => getTopic(letter)?.color || '';

export const formatSubtopicLabel = (subtopic) => {
  if (!subtopic) return '';
  return subtopic.name ? `${subtopic.number} · ${subtopic.name}` : String(subtopic.number);
};
