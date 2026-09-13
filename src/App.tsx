import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from './components/Shell'
import { LibraryProvider } from './state/LibraryContext'
import { Home } from './pages/Home'
import { Library } from './pages/Library'
import { SessionPlayer } from './pages/SessionPlayer'
import { BreathingList } from './pages/BreathingList'
import { BreathingPlayer } from './pages/BreathingPlayer'
import { CourseDetail } from './pages/CourseDetail'
import { Affirmations } from './pages/Affirmations'
import { Favorites } from './pages/Favorites'
import { Profile } from './pages/Profile'

export default function App() {
  return (
    <LibraryProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/session/:id" element={<SessionPlayer />} />
            <Route path="/breathing" element={<BreathingList />} />
            <Route path="/breathing/:id" element={<BreathingPlayer />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/affirmations" element={<Affirmations />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </LibraryProvider>
  )
}
