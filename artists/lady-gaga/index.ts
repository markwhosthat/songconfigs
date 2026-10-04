import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

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
// Albums whole, each with every one of its song types.
const wholeAlbums = (albums: string[]) =>
  keep(Object.fromEntries(albums.map(a => [a, variantsOf(a)])));

// Her solo pop records, without the jazz albums or the A Star Is Born soundtrack.
const POP_ALBUMS = ['The Fame', 'The Fame Monster', 'Born This Way', 'ARTPOP', 'Joanne', 'Chromatica', 'Mayhem'];
const JAZZ_ALBUMS = ['Cheek to Cheek', 'Love for Sale', 'Harlequin'];

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

// The three songs she wrote for The Devil Wears Prada 2.
const PRADA_SONGS = ['Runway (with Doechii)', 'Shape of a Woman', 'Glamorous Life'];
const prada = {
  ...keep({ 'Other Songs': ['Soundtrack'] }),
  excludedSongs: songs.filter(s => s.album === 'Other Songs' && !PRADA_SONGS.includes(s.title)).map(s => s.id),
};

export const LadyGagaConfig: ArtistConfig = {
  id: 'lady-gaga',
  name: 'Lady Gaga',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Mayhem',
  storageKey: 'gaga-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Special and deluxe editions, and Mayhem's reissue (The Dead Dance).
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Tracks only on some regional or store editions.
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    { label: 'Holiday', variants: ['Holiday'] },
    { label: 'Features', variants: ['Features'] },
    { label: 'Covers', variants: ['Covers'] },
  ],
  // Songs where she is a featured guest rather than a main artist, and her
  // one-off covers (the jazz albums are albums, so they stay in).
  defaultExcludedVariants: ['Other Songs:Features', 'Other Songs:Covers'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Lady Gaga song, from The Fame and Born This Way to Chromatica, Mayhem and The Devil Wears Prada 2. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Devil Wears Prada 2': {
        title: 'Rank Lady Gaga\'s The Devil Wears Prada 2 Songs | Lady Gaga Song Sorter',
        description: 'Rank Runway (with Doechii), Shape of a Woman and Glamorous Life, the three songs Lady Gaga wrote for The Devil Wears Prada 2, two at a time.',
      },
      'The Pop Albums': {
        title: 'Rank Every Lady Gaga Pop Album Song | Lady Gaga Song Sorter',
        description: 'Rank the songs from Lady Gaga\'s pop albums: The Fame, The Fame Monster, Born This Way, ARTPOP, Joanne, Chromatica and Mayhem, two at a time.',
      },
      'The Fame + The Fame Monster': {
        title: 'Rank The Fame + The Fame Monster | Lady Gaga Song Sorter',
        description: 'Rank The Fame and The Fame Monster together, from Just Dance, Poker Face and Paparazzi to Bad Romance, Telephone and Alejandro, two at a time.',
      },
      'The Jazz Albums': {
        title: 'Rank Lady Gaga\'s Jazz Albums | Lady Gaga Song Sorter',
        description: 'Rank Lady Gaga\'s jazz records together: Cheek to Cheek and Love for Sale with Tony Bennett, and Harlequin, two at a time.',
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Lady Gaga Deluxe & Bonus Tracks | Lady Gaga Song Sorter',
        description: 'Rank Lady Gaga\'s deluxe and bonus tracks, from Disco Heaven and The Queen to Grigio Girls, Love Me Right, The Dead Dance and Kill for Love, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Lady Gaga Song | Lady Gaga Song Sorter',
        description: 'Rank every Lady Gaga song: every album, deluxe and bonus track, remix, single, feature and cover. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Lady Gaga Album Tracks Only | Lady Gaga Song Sorter',
        description: 'Rank the standard tracklists of Lady Gaga\'s albums, without deluxe or bonus tracks. Choose between two songs at a time.',
      },
      'Beyond the Albums': {
        title: 'Rank Lady Gaga\'s Non-Album Songs | Lady Gaga Song Sorter',
        description: 'Rank the Lady Gaga songs outside her albums, from Hello, Hello, Til It Happens to You, The Cure and Hold My Hand to Runway, plus her features and Christmas songs, two at a time.',
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
      name: 'The Devil Wears Prada 2',
      label: 'Devil Wears Prada 2',
      group: 'New',
      slug: 'the-devil-wears-prada-2',
      ...prada,
      themeKey: 'Mayhem',
      // Three songs no album page lists on their own - worth a search result.
      indexable: true,
    },
    {
      name: 'The Pop Albums',
      label: 'Pop albums',
      group: 'Collections',
      slug: 'pop-albums',
      ...wholeAlbums(POP_ALBUMS),
      indexable: true,
    },
    {
      name: 'The Fame + The Fame Monster',
      label: 'The Fame + Monster',
      group: 'Collections',
      slug: 'the-fame-and-the-fame-monster',
      ...wholeAlbums(['The Fame', 'The Fame Monster']),
      themeKey: 'The Fame Monster',
      indexable: true,
    },
    {
      name: 'The Jazz Albums',
      label: 'Jazz albums',
      group: 'Collections',
      slug: 'jazz-albums',
      ...wholeAlbums(JAZZ_ALBUMS),
      themeKey: 'Harlequin',
      indexable: true,
    },
    {
      name: 'Deluxe & Bonus Tracks',
      label: 'Deluxe & bonus only',
      group: 'Collections',
      slug: 'deluxe-and-bonus-tracks',
      ...forAlbums(EXTRAS, ['Deluxe', 'Bonus']),
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
