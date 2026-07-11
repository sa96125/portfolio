import { useCallback, useEffect, useState } from "react";
import MenuBar from "./components/menubar/MenuBar";
import Desktop from "./components/desktop/Desktop";
import Dock from "./components/dock/Dock";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import AboutModal from "./components/about/AboutModal";
import LockScreen from "./components/lockscreen/LockScreen";
import Notification from "./components/notification/Notification";
import { useWindows } from "./hooks/useWindows";

export default function App() {
  const [locked, setLocked] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const { openWindow } = useWindows();

  useEffect(() => {
    openWindow({
      id: "help-main",
      kind: "help",
      title: "시작하기",
      payload: {},
      width: 500,
      height: 520,
    });
  }, [openWindow]);

  const handleUnlock = useCallback(() => {
    setLocked(false);
    setShowNotif(true);
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
