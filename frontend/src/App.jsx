import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserForm from './components/UserForm';
import QRView from './components/QRView';
import ProfileView from './components/ProfileView';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/qr/:id" element={<QRView />} />
          <Route path="/profile/:id" element={<ProfileView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
