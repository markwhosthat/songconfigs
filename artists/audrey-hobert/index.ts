import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const AudreyHobertConfig: ArtistConfig = {
  id: 'audrey-hobert',
  name: 'Audrey Hobert',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: "Who's the Clown?",
  storageKey: 'audrey-hobert-song-sorter-session',
};
