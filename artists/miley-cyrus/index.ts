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

// Her Hollywood Records albums, from Meet Miley Cyrus to Can't Be Tamed.
const DISNEY_ERA = ['Meet Miley Cyrus', 'Breakout', 'The Time of Our Lives', "Can't Be Tamed"];

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

export const MileyCyrusConfig: ArtistConfig = {
  id: 'miley-cyrus',
  name: 'Miley Cyrus',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Bass Persuades',
  storageKey: 'miley-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Deluxe and platinum editions, and digital reissues (Used to Be Young).
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Pre-order and store extras: Plastic Hearts' live covers.
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    { label: 'Holiday', variants: ['Holiday'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she is a featured guest rather than a main artist.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Miley Cyrus song, from Meet Miley Cyrus and Bangerz to Plastic Hearts, Endless Summer Vacation, Something Beautiful and Bass Persuades. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Disney Era': {
        title: "Rank Miley Cyrus's Disney Era | Miley Cyrus Song Sorter",
        description: "Rank Miley Cyrus's Hollywood Records years: Meet Miley Cyrus, Breakout, The Time of Our Lives and Can't Be Tamed, from See You Again and 7 Things to Party in the U.S.A. and The Climb, two at a time.",
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Miley Cyrus Deluxe & Bonus Tracks | Miley Cyrus Song Sorter',
        description: 'Rank Miley Cyrus\'s deluxe and bonus tracks, from Rooting for My Baby and Hands in the Air to Used to Be Young, Secrets and Lockdown, two at a time.',
      },
      'Collaborations': {
        title: 'Rank Miley Cyrus Collaborations & Features | Miley Cyrus Song Sorter',
        description: 'Rank the songs Miley Cyrus features on, from Ready, Set, Don\'t Go and Nothing Breaks Like a Heart to Doctor (Work It Out) and II Most Wanted, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Miley Cyrus Song | Miley Cyrus Song Sorter',
        description: 'Rank every Miley Cyrus song: every album, deluxe and bonus track, remix, single, soundtrack song and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Miley Cyrus Album Tracks Only | Miley Cyrus Song Sorter',
        description: "Rank the standard tracklists of Miley Cyrus's albums, without deluxe, bonus or remix tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Miley Cyrus's Non-Album Songs | Miley Cyrus Song Sorter",
        description: 'Rank the Miley Cyrus songs outside her albums, from Hoedown Throwdown and Slide Away to Don\'t Call Me Angel, Dream as One and Younger You, two at a time.',
      },
    },
  },
  promo: {
    text: 'Bass Persuades is out now',
    links: [
      { label: 'Rank Bass Persuades', slug: 'bass-persuades' },
    ],
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
      name: 'The Disney Era',
      label: 'Disney era',
      group: 'Collections',
      slug: 'disney-era',
      ...wholeAlbums(DISNEY_ERA),
      themeKey: 'Breakout',
      // A grouping no album page covers - worth a search result.
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
    {
      name: 'Collaborations',
      group: 'Beyond',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Features'] }),
      indexable: true,
    },
  ],
};
