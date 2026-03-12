import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const ArianaGrandeConfig: ArtistConfig = {
  id: 'ariana-grande',
  name: 'Ariana Grande',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'eternal sunshine',
  storageKey: 'ag-song-sorter-session',
};
