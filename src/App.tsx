import { AnatomyProvider } from './context/AnatomyContext';
import AnatomyScene from './components/AnatomyScene';
import Header from './components/ui/Header';
import Sidebar from './components/ui/Sidebar';
import OrganDetail from './components/ui/OrganDetail';

function App() {
  return (
    <AnatomyProvider>
      <div className="w-screen h-screen overflow-hidden bg-[#1A1F2A] relative">
        <div className="absolute inset-0 z-0">
          <AnatomyScene />
        </div>
        <Header />
        <Sidebar />
        <OrganDetail />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <p className="text-[10px] text-white/20 tracking-wider">
            Click an organ to explore -- Drag to rotate -- Scroll to zoom
          </p>
        </div>
      </div>
    </AnatomyProvider>
  );
}

export default App;
