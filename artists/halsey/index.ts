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

// Her debut EP and debut album, as the Badlands Decade Edition and the Back
// to Badlands tour revisit them.
const BADLANDS_ERA = ['Room 93', 'Badlands'];

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

export const HalseyConfig: ArtistConfig = {
  id: 'halsey',
  name: 'Halsey',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'The Great Impersonator',
  storageKey: 'halsey-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Deluxe, extended and digital reissue tracks.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Badlands Decade Edition rarities: Garden and You(th).
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she shares the bill on someone else's record.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Halsey song, from Room 93 and Badlands to Hopeless Fountain Kingdom, Manic, If I Can\'t Have Love, I Want Power and The Great Impersonator. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'Back to Badlands': {
        title: "Rank Halsey's Badlands Era | Halsey Song Sorter",
        description: 'Rank Room 93 and Badlands with every deluxe track and Decade Edition rarity, from Ghost and Hurricane to New Americana, Colors and Gasoline, two at a time.',
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Halsey Deluxe & Bonus Tracks | Halsey Song Sorter',
        description: "Rank Halsey's deluxe and bonus tracks, from Gasoline and Angel on Fire to Be Kind, Nightmare, Lucid and Carry the Weight, two at a time.",
      },
      'Collaborations': {
        title: 'Rank Halsey Collaborations & Features | Halsey Song Sorter',
        description: 'Rank the songs Halsey features on, from Closer and Him & I to Eastside, Boy with Luv and Forget Me Too, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Halsey Song | Halsey Song Sorter',
        description: 'Rank every Halsey song: every album, deluxe and bonus track, remix, single, soundtrack song and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Halsey Album Tracks Only | Halsey Song Sorter',
        description: "Rank the standard tracklists of Halsey's albums, without deluxe, bonus or remix tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Halsey's Non-Album Songs | Halsey Song Sorter",
        description: 'Rank the Halsey songs outside her albums, from Not Afraid Anymore and So Good to Die 4 Me, Safeword and Hand That Feeds, two at a time.',
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
      name: 'Back to Badlands',
      label: 'Badlands era',
      group: 'Collections',
      slug: 'back-to-badlands',
      ...wholeAlbums(BADLANDS_ERA),
      themeKey: 'Badlands',
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
