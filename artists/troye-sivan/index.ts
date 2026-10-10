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

// His studio albums; the Trxye and In A Dream EPs stand apart.
const STUDIO_ALBUMS = ['Blue Neighbourhood', 'Bloom', 'Something To Give Each Other', "She's the Best"];
const EPS = ['Trxye', 'In A Dream'];

export const TroyeSivanConfig: ArtistConfig = {
  id: 'troye-sivan',
  name: 'Troye Sivan',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: "She's the Best",
  storageKey: 'troye-sivan-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Blue Neighbourhood's deluxe songs and its Target bonus Swimming Pools.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // The June Haverly songs, Somebody to Love and Angel Baby.
    { label: 'Singles', variants: ['Singles'] },
    // Strawberries & Cigarettes (Love, Simon), Revelation (Boy Erased),
    // Trouble and Wait (Three Months), My Sweet Lord (The Idol), Lonely
    // People (Trolls Band Together) and LA Wants Me Dead (The Shards).
    { label: 'Soundtracks', variants: ['Soundtracks'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Left out until someone opts in: the songs where he shares the billing
  // on someone else's record.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: "Rank every Troye Sivan song, from Trxye and Blue Neighbourhood to Bloom, Something To Give Each Other and She's the Best. Choose between two songs at a time to build your ultimate personal ranking.",
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Troye Sivan Album Song | Troye Sivan Song Sorter',
        description: "Rank the songs from Blue Neighbourhood, Bloom, Something To Give Each Other and She's the Best together, deluxe tracks included, two at a time.",
      },
      'The EPs': {
        title: 'Rank Trxye and In A Dream | Troye Sivan Song Sorter',
        description: "Rank the songs from Troye Sivan's EPs Trxye and In A Dream, from Happy Little Pill and Fun to Take Yourself Home and Easy, two at a time.",
      },
      'Collaborations': {
        title: 'Rank Troye Sivan Collaborations & Features | Troye Sivan Song Sorter',
        description: 'Rank the songs Troye Sivan features on, from Papercut and There for You to 1999, supernatural, Talk talk and Physical, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Troye Sivan Song | Troye Sivan Song Sorter',
        description: 'Rank every Troye Sivan song: every album, EP and deluxe track, single, soundtrack song and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Troye Sivan Album Tracks Only | Troye Sivan Song Sorter',
        description: "Rank the standard tracklists of Troye Sivan's albums and EPs, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Troye Sivan's Non-Album Songs | Troye Sivan Song Sorter",
        description: 'Rank the Troye Sivan songs outside his records, from Strawberries & Cigarettes and Revelation to Somebody to Love, Angel Baby and LA Wants Me Dead, plus his features, two at a time.',
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
      name: 'The Studio Albums',
      label: 'Studio albums',
      group: 'Collections',
      slug: 'studio-albums',
      ...forAlbums(STUDIO_ALBUMS, [STANDARD_VARIANT, 'Deluxe']),
      indexable: true,
    },
    {
      name: 'The EPs',
      label: 'EPs',
      group: 'Collections',
      slug: 'eps',
      ...forAlbums(EPS, [STANDARD_VARIANT]),
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
