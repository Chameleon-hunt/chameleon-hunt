import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "ar" | "ru" | "he";

export const RTL_LANGS: Lang[] = ["ar", "he"];

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN", ar: "عربي", ru: "RU", he: "עברית",
};

type T = {
  // Nav
  home: string; map: string; characters: string; leaderboard: string; howToPlay: string;
  // Hero
  tagline: string; startHunt: string; charactersHidden: string; cityActive: string;
  findThemTitle: string; newCityAdded: string;
  // Feature cards
  theMap: string; exploreCities: string; findCharacters: string; discoverAll: string;
  topHunters: string; easyToLearn: string; hardToMaster: string; getCoolGear: string;
  // Footer
  foundItKeepIt: string;
  // Game nav
  back: string;
  // Sheet
  locationHint: string; foundIt: string; navigate: string; reroute: string; mapsBtn: string;
  alreadyFound: string; hiddenLabel: string; foundLabel: string;
  // Report
  reportBtn: string; reportTitle: string; reportDesc: string; submitReport: string;
  cancel: string; reportSent: string; reportError: string;
  // HTP
  howToPlayTitle: string; step1title: string; step1body: string; step2title: string;
  step2body: string; step3title: string; step3body: string; step4title: string; step4body: string;
  keepItMsg: string; keepItSub: string;
  // Characters view
  charactersTitle: string; theTargets: string;
  // Coming soon
  comingSoon: string; comingSoonSub: string;
  // Reset
  resetProgress: string; resetConfirm: string;
  // Navigation ETA
  minWalk: string; metersAway: string; kmAway: string; openMaps: string;
  navError: string;
};

const TRANSLATIONS: Record<Lang, T> = {
  en: {
    home: "HOME", map: "MAP", characters: "CHARACTERS", leaderboard: "LEADERBOARD", howToPlay: "HOW TO PLAY",
    tagline: "A real city. Hidden characters.\nYour mission.",
    startHunt: "START HUNT", charactersHidden: "Characters Hidden", cityActive: "City Active",
    findThemTitle: "FIND THEM.\nAIM HIGHER.\nBE THE BEST.", newCityAdded: "NEW\nCITY\nADDED!",
    theMap: "THE MAP", exploreCities: "Explore cities", findCharacters: "Find characters",
    discoverAll: "Discover them all", topHunters: "Top hunters", easyToLearn: "Easy to learn",
    hardToMaster: "Hard to master", getCoolGear: "Get cool gear",
    foundItKeepIt: "Found it? Keep it!",
    back: "Back",
    locationHint: "LOCATION HINT", foundIt: "FOUND IT!", navigate: "Navigate", reroute: "Reroute",
    mapsBtn: "Maps", alreadyFound: "Already Found!", hiddenLabel: "HIDDEN", foundLabel: "FOUND",
    reportBtn: "⚠️ Report: Not Here",
    reportTitle: "Report Missing Chameleon",
    reportDesc: "Is this chameleon no longer at this location? Let us know and we'll investigate.",
    submitReport: "Send Report", cancel: "Cancel",
    reportSent: "Report sent! Thank you.", reportError: "Failed to send. Try again.",
    howToPlayTitle: "How To Play",
    step1title: "Explore the map", step1body: "Open the map and find the white chameleon markers scattered around the city.",
    step2title: "Head to the location", step2body: "Follow the walking directions to navigate to the figure's real-world hiding spot.",
    step3title: "Find the figure", step3body: "Look around carefully — the hand-painted figure is hidden somewhere nearby.",
    step4title: "Snap a photo", step4body: "Tap 'Found It!', take a photo as proof, and submit. The figure is now yours to keep!",
    keepItMsg: "Found it? Keep it! 🎉", keepItSub: "Each figure is a hand-painted collectible from the Mecha Chameleon board game. If you find it, it's yours!",
    charactersTitle: "Characters", theTargets: "The Targets",
    comingSoon: "Coming Soon", comingSoonSub: "This feature is on its way. Stay tuned!",
    resetProgress: "Reset Progress", resetConfirm: "Reset your progress? This cannot be undone.",
    minWalk: "min walk", metersAway: "meters away", kmAway: "km away", openMaps: "Open Maps",
    navError: "Could not get your location. Make sure GPS is on and you've allowed location access.",
  },
  ar: {
    home: "الرئيسية", map: "الخريطة", characters: "الشخصيات", leaderboard: "المتصدرون", howToPlay: "كيف تلعب",
    tagline: "مدينة حقيقية. شخصيات مخفية.\nمهمتك.",
    startHunt: "ابدأ الصيد", charactersHidden: "شخصية مخفية", cityActive: "مدينة نشطة",
    findThemTitle: "اعثر عليهم.\nاستهدف أعلى.\nكن الأفضل.", newCityAdded: "مدينة\nجديدة\nأضيفت!",
    theMap: "الخريطة", exploreCities: "استكشف المدن", findCharacters: "ابحث عن الشخصيات",
    discoverAll: "اكتشف الكل", topHunters: "أفضل الصيادين", easyToLearn: "سهل التعلم",
    hardToMaster: "صعب الإتقان", getCoolGear: "احصل على معدات",
    foundItKeepIt: "وجدته؟ احتفظ به!",
    back: "رجوع",
    locationHint: "تلميح الموقع", foundIt: "وجدته!", navigate: "ابحث عن الطريق", reroute: "أعد التوجيه",
    mapsBtn: "الخرائط", alreadyFound: "تم إيجاده!", hiddenLabel: "مخفي", foundLabel: "تم إيجاده",
    reportBtn: "⚠️ تبليغ: غير موجود",
    reportTitle: "الإبلاغ عن الكاميليون المفقود",
    reportDesc: "هل الكاميليون لم يعد في هذا الموقع؟ أخبرنا وسنحقق في الأمر.",
    submitReport: "إرسال البلاغ", cancel: "إلغاء",
    reportSent: "تم إرسال البلاغ! شكراً.", reportError: "فشل الإرسال. حاول مجدداً.",
    howToPlayTitle: "كيف تلعب",
    step1title: "استكشف الخريطة", step1body: "افتح الخريطة وابحث عن العلامات البيضاء للكاميليون.",
    step2title: "توجه إلى الموقع", step2body: "اتبع التعليمات للوصول إلى المخبأ الحقيقي للشخصية.",
    step3title: "ابحث عن الشخصية", step3body: "انظر جيداً — الشخصية المرسومة يدوياً مخبأة في مكان قريب.",
    step4title: "التقط صورة", step4body: "اضغط 'وجدته!'، التقط صورة كدليل وأرسلها. الشخصية لك!",
    keepItMsg: "وجدته؟ احتفظ به! 🎉", keepItSub: "كل شخصية مرسومة يدوياً من لعبة Mecha Chameleon. إذا وجدتها، فهي لك!",
    charactersTitle: "الشخصيات", theTargets: "الأهداف",
    comingSoon: "قريباً", comingSoonSub: "هذه الميزة قادمة قريباً. ترقب!",
    resetProgress: "إعادة التعيين", resetConfirm: "هل تريد إعادة تعيين تقدمك؟ لا يمكن التراجع.",
    minWalk: "دقيقة مشياً", metersAway: "متر بعيد", kmAway: "كم بعيد", openMaps: "افتح الخرائط",
    navError: "تعذر الحصول على موقعك. تأكد من تشغيل GPS وإتاحة الوصول إليه.",
  },
  ru: {
    home: "ГЛАВНАЯ", map: "КАРТА", characters: "ПЕРСОНАЖИ", leaderboard: "РЕЙТИНГ", howToPlay: "КАК ИГРАТЬ",
    tagline: "Реальный город. Спрятанные персонажи.\nВаша миссия.",
    startHunt: "НАЧАТЬ ОХОТУ", charactersHidden: "Персонажей спрятано", cityActive: "Активный город",
    findThemTitle: "НАЙДИ ИХ.\nЦЕЛЬСЯ ВЫШЕ.\nБУДЬ ЛУЧШИМ.", newCityAdded: "НОВЫЙ\nГОРОД\nДОБАВЛЕН!",
    theMap: "КАРТА", exploreCities: "Исследуй города", findCharacters: "Найди персонажей",
    discoverAll: "Открой всех", topHunters: "Лучшие охотники", easyToLearn: "Легко учиться",
    hardToMaster: "Сложно освоить", getCoolGear: "Крутое снаряжение",
    foundItKeepIt: "Нашёл? Забирай!",
    back: "Назад",
    locationHint: "ПОДСКАЗКА", foundIt: "НАШЁЛ!", navigate: "Навигация", reroute: "Перестроить",
    mapsBtn: "Карты", alreadyFound: "Уже найдено!", hiddenLabel: "СПРЯТАН", foundLabel: "НАЙДЕН",
    reportBtn: "⚠️ Сообщить: Не на месте",
    reportTitle: "Сообщить об отсутствии",
    reportDesc: "Персонаж больше не на этом месте? Сообщите нам, и мы проверим.",
    submitReport: "Отправить", cancel: "Отмена",
    reportSent: "Сообщение отправлено! Спасибо.", reportError: "Ошибка отправки. Попробуйте снова.",
    howToPlayTitle: "Как играть",
    step1title: "Исследуй карту", step1body: "Открой карту и найди белые маркеры хамелеонов по городу.",
    step2title: "Иди к точке", step2body: "Следуй указаниям, чтобы добраться до реального укрытия.",
    step3title: "Найди фигурку", step3body: "Смотри внимательно — расписная фигурка где-то рядом.",
    step4title: "Сфотографируй", step4body: "Нажми 'Нашёл!', сделай фото как доказательство и отправь. Фигурка твоя!",
    keepItMsg: "Нашёл? Забирай! 🎉", keepItSub: "Каждая фигурка — это коллекционный предмет из настолки Mecha Chameleon. Нашёл — твоя!",
    charactersTitle: "Персонажи", theTargets: "Цели",
    comingSoon: "Скоро", comingSoonSub: "Эта функция скоро появится. Следите за обновлениями!",
    resetProgress: "Сбросить прогресс", resetConfirm: "Сбросить прогресс? Это нельзя отменить.",
    minWalk: "мин пешком", metersAway: "м отсюда", kmAway: "км отсюда", openMaps: "Открыть карты",
    navError: "Не удалось получить местоположение. Убедитесь, что GPS включён и разрешён.",
  },
  he: {
    home: "בית", map: "מפה", characters: "דמויות", leaderboard: "טבלת ניקוד", howToPlay: "איך משחקים",
    tagline: "עיר אמיתית. דמויות מוסתרות.\nהמשימה שלך.",
    startHunt: "התחל לצוד", charactersHidden: "דמויות מוסתרות", cityActive: "עיר פעילה",
    findThemTitle: "מצא אותם.\nכוון גבוה.\nהיה הטוב ביותר.", newCityAdded: "עיר\nחדשה\nנוספה!",
    theMap: "המפה", exploreCities: "חקור ערים", findCharacters: "מצא דמויות",
    discoverAll: "גלה את כולם", topHunters: "הצייד המובהק", easyToLearn: "קל ללמוד",
    hardToMaster: "קשה לשלוט", getCoolGear: "קנה ציוד מגניב",
    foundItKeepIt: "מצאת? שמור!",
    back: "חזרה",
    locationHint: "רמז מיקום", foundIt: "מצאתי!", navigate: "נווט", reroute: "נווט מחדש",
    mapsBtn: "מפות", alreadyFound: "כבר נמצא!", hiddenLabel: "מוסתר", foundLabel: "נמצא",
    reportBtn: "⚠️ דווח: לא כאן",
    reportTitle: "דיווח על דמות חסרה",
    reportDesc: "הדמות כבר לא במיקום זה? ספר לנו ונבדוק.",
    submitReport: "שלח דיווח", cancel: "ביטול",
    reportSent: "הדיווח נשלח! תודה.", reportError: "שליחה נכשלה. נסה שוב.",
    howToPlayTitle: "איך משחקים",
    step1title: "חקור את המפה", step1body: "פתח את המפה ומצא את סמני הכאמליאון הלבן ברחבי העיר.",
    step2title: "הגע למיקום", step2body: "עקוב אחרי ההוראות כדי להגיע למסתור האמיתי.",
    step3title: "מצא את הדמות", step3body: "תסתכל היטב — הדמות הצבועה ביד מוסתרת איפשהו בקרבת מקום.",
    step4title: "צלם תמונה", step4body: "לחץ 'מצאתי!', צלם תמונה כהוכחה ושלח. הדמות שלך!",
    keepItMsg: "מצאת? שמור! 🎉", keepItSub: "כל דמות היא פריט אספנות צבוע ביד ממשחק Mecha Chameleon. אם מצאת — זה שלך!",
    charactersTitle: "דמויות", theTargets: "המטרות",
    comingSoon: "בקרוב", comingSoonSub: "פיצ׳ר זה בדרך. תישאר מעודכן!",
    resetProgress: "אפס התקדמות", resetConfirm: "לאפס את ההתקדמות? לא ניתן לבטל.",
    minWalk: "דק׳ הליכה", metersAway: "מטרים", kmAway: "ק״מ", openMaps: "פתח מפות",
    navError: "לא ניתן לקבל מיקום. ודא שה-GPS פועל ושנתת הרשאת גישה.",
  },
};

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: T; isRTL: boolean };
const Ctx = createContext<LangCtx>({
  lang: "en", setLang: () => {}, t: TRANSLATIONS.en, isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const isRTL = RTL_LANGS.includes(lang);
  return (
    <Ctx.Provider value={{ lang, setLang, t: TRANSLATIONS[lang], isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: lang === "ar" || lang === "he" ? "'Arial', sans-serif" : undefined }}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
