import { useState } from "react";
import MenuBar from "./components/menubar/MenuBar";
import Desktop from "./components/desktop/Desktop";
import Dock from "./components/dock/Dock";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import AboutModal from "./components/about/AboutModal";
import LockScreen from "./components/lockscreen/LockScreen";
import Notification from "./components/notification/Notification";

export default function App() {
  const [locked, setLocked] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <>
      <Desktop />
      <MenuBar />
      <Dock />
      <ChatbotWidget />
      <AboutModal />
      {locked && <LockScreen onUnlock={() => { setLocked(false); setShowNotif(true); }} />}
      <Notification show={showNotif} onClose={() => setShowNotif(false)} />
    </>
  );
}
