import {
  Sparkles,
  Moon,
  Wind,
  Waves,
  Music2,
  BookOpen,
  Home,
  Library,
  Heart,
  User,
  Search,
} from 'lucide-react'
import type { ContentType } from '../data/types'

export const typeIcons: Record<ContentType, typeof Sparkles> = {
  meditation: Sparkles,
  sleep: Moon,
  breathing: Wind,
  sound: Waves,
  music: Music2,
  course: BookOpen,
}

export const navIcons = { Home, Library, Heart, User, Search, Wind }
