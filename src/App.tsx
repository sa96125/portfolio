import MenuBar from "./components/menubar/MenuBar";
import Desktop from "./components/desktop/Desktop";
import Dock from "./components/dock/Dock";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import AboutModal from "./components/about/AboutModal";

export default function App() {
  return (
    <>
      <Desktop />
      <MenuBar />
      <Dock />
      <ChatbotWidget />
      <AboutModal />
    </>
  );
}
