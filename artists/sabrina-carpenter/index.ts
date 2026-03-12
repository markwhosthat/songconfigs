import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const SabrinaCarpenterConfig: ArtistConfig = {
  id: 'sabrina-carpenter',
  name: 'Sabrina Carpenter',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: "Short n' Sweet",
  storageKey: 'sabrina-song-sorter-session',
};
