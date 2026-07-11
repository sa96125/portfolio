import { useCallback, useState } from "react";
import MenuBar from "./components/menubar/MenuBar";
import Desktop from "./components/desktop/Desktop";
import Dock from "./components/dock/Dock";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import AboutModal from "./components/about/AboutModal";
import LockScreen from "./components/lockscreen/LockScreen";
import Notification from "./components/notification/Notification";
import { useGlobalStore } from "./store/useGlobalStore";

export default function App() {
  const [locked, setLocked] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  const handleUnlock = useCallback(() => {
    setLocked(false);
    setShowNotif(true);
    useGlobalStore.getState().openAbout(); // 첫 화면: 사이트 소개 팝업
  }, []);

  return (
    <>
      <Desktop />
      <MenuBar />
      <Dock />
      <ChatbotWidget />
      <AboutModal />
      {locked && <LockScreen onUnlock={handleUnlock} />}
      <Notification show={showNotif} onClose={() => setShowNotif(false)} />
    </>
  );
}
