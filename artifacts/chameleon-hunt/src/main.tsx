import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// פונקציה גלובלית שתטפל בהתחברות של גוגל מכל מקום באפליקציה
(window as any).handleGoogleLogin = (response: any) => {
  console.log("התחברת בהצלחה! הנה הטוקן מגוגל:", response.credential);
  // כאן בהמשך נשלח את זה לשרת שלך ב-Render
};

createRoot(document.getElementById("root")!).render(<App />);
