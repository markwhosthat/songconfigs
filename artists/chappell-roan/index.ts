import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const MIDWEST_PRINCESS = 'The Rise and Fall of a Midwest Princess';

// Builds a preset's filters from what it keeps: these albums, and in each
// only the listed variants (Standard for its untagged main tracks).
const ALBUMS = [...new Set(songs.map(s => s.album))];
const variantsOf = (album: string) =>
  [STANDARD_VARIANT, ...new Set(songs.filter(s => s.album === album).flatMap(s => s.variants ?? []))];
const keep = (spec: Record<string, string[]>) => ({
  excludedAlbums: ALBUMS.filter(a => !(a in spec)),
  excludedVariants: Object.entries(spec).flatMap(([album, kept]) =>
    variantsOf(album).filter(v => !kept.includes(v)).map(v => `${album}:${v}`)),
});
const forAlbums = (albums: string[], kept: string[]) =>
  keep(Object.fromEntries(albums.map(a => [a, kept])));

const idsOf = (titles: string[], album?: string) => titles.map(title => {
  const song = songs.find(s => s.title === title && (!album || s.album === album));
  if (!song) throw new Error(`Chappell Roan: no song "${title}"`);
  return song.id;
});

// The singles since the album, from its Midwest Princess run onwards.
const AFTER_THE_ALBUM = idsOf(['Good Luck, Babe!', 'The Giver', 'The Subway'], 'Other Songs');

export const ChappellRoanConfig: ArtistConfig = {
  id: 'chappell-roan',
  name: 'Chappell Roan',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: MIDWEST_PRINCESS,
  storageKey: 'chappell-roan-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    { label: 'Remix & acoustic', variants: ['Remix', 'Acoustic'] },
    { label: 'Singles', variants: ['Singles'] },
  ],
  // The remix and acoustic take of School Nights songs, which repeat songs
  // already in the sort.
  defaultExcludedVariants: ['School Nights:Remix', 'School Nights:Acoustic'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Chappell Roan song, from the School Nights EP and The Rise and Fall of a Midwest Princess to Good Luck, Babe!, The Giver and The Subway. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'Midwest Princess + the Singles': {
        title: 'Rank Midwest Princess + the Singles | Chappell Roan Song Sorter',
        description: 'Rank The Rise and Fall of a Midwest Princess together with Good Luck, Babe!, The Giver and The Subway, from Pink Pony Club and HOT TO GO! to Casual, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Chappell Roan Song | Chappell Roan Song Sorter',
        description: 'Rank every Chappell Roan song: the album, the School Nights EP, every single, remix and acoustic version. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Chappell Roan Album Tracks Only | Chappell Roan Song Sorter',
        description: 'Rank the tracklists of The Rise and Fall of a Midwest Princess and the School Nights EP, without singles or alternate versions. Choose between two songs at a time.',
      },
      'Beyond the Albums': {
        title: "Rank Chappell Roan's Non-Album Singles | Chappell Roan Song Sorter",
        description: "Rank the Chappell Roan singles outside her records, from Bitter, School Nights and Love Me Anyway to Good Luck, Babe!, The Giver and The Subway, two at a time.",
      },
    },
  },
  // Listed under their group in the Filters panel ("Start from"), after the
  // default; `label` is the button's name where the page's name is longer.
  filterPresets: [
    {
      name: 'Everything',
      slug: 'everything',
      excludedAlbums: [],
      excludedVariants: [],
    },
    {
      name: 'Standard Tracks',
      label: 'Album tracks only',
      slug: 'standard-tracks',
      // Exactly the Album tracks song type on its own.
      ...forAlbums(ALBUMS, [STANDARD_VARIANT]),
    },
    {
      name: 'Midwest Princess + the Singles',
      label: 'Midwest Princess + singles',
      group: 'Collections',
      slug: 'midwest-princess-and-singles',
      ...keep({ [MIDWEST_PRINCESS]: [STANDARD_VARIANT], 'Other Songs': ['Singles'] }),
      excludedSongs: songs.filter(s => s.album === 'Other Songs' && !AFTER_THE_ALBUM.includes(s.id)).map(s => s.id),
      themeKey: MIDWEST_PRINCESS,
      // A set no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
  ],
};
