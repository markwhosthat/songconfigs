import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const SNS = "Short n' Sweet";
const MBF = "Man's Best Friend";

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

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

export const SabrinaCarpenterConfig: ArtistConfig = {
  id: 'sabrina-carpenter',
  name: 'Sabrina Carpenter',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: MBF,
  storageKey: 'sabrina-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // emails i can't send fwd: and Short n' Sweet (Deluxe).
    { label: 'Deluxe', variants: ['Deluxe'] },
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she is a featured guest rather than a main artist.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: "Rank every Sabrina Carpenter song, from Eyes Wide Open to Short n' Sweet and Man's Best Friend. Choose between two songs at a time to build your ultimate personal ranking.",
    pages: {
      [`${SNS} + ${MBF}`]: {
        title: "Rank Short n' Sweet + Man's Best Friend | Sabrina Carpenter Song Sorter",
        description: "Rank Short n' Sweet and Man's Best Friend together, deluxe and bonus tracks included, from Espresso and Please Please Please to Manchild and Tears, two at a time.",
      },
      'Singular: Act I + Act II': {
        title: 'Rank Singular: Act I + Act II | Sabrina Carpenter Song Sorter',
        description: "Rank both acts of Sabrina Carpenter's Singular together, from Almost Love, Sue Me and Paris to In My Bed, Pushing 20 and Exhale, two at a time.",
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Sabrina Carpenter Deluxe & Bonus Tracks | Sabrina Carpenter Song Sorter',
        description: "Rank Sabrina Carpenter's deluxe and bonus tracks: Feather and opposite from emails i can't send fwd:, 15 Minutes and Busy Woman from Short n' Sweet, and Such a Funny Way, two at a time.",
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Sabrina Carpenter Song | Sabrina Carpenter Song Sorter',
        description: 'Rank every Sabrina Carpenter song: every album, deluxe and bonus track, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Sabrina Carpenter Album Tracks Only | Sabrina Carpenter Song Sorter',
        description: "Rank the standard tracklists of Sabrina Carpenter's albums, without deluxe or bonus tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Sabrina Carpenter's Non-Album Songs | Sabrina Carpenter Song Sorter",
        description: 'Rank the Sabrina Carpenter songs outside her albums, from Smoke and Fire, Why and Skin to Alien, Hands and On My Way, plus First Love, two at a time.',
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
      name: `${SNS} + ${MBF}`,
      label: "Short n' Sweet + MBF",
      group: 'Collections',
      slug: 'short-n-sweet-and-mans-best-friend',
      ...wholeAlbums([SNS, MBF]),
      themeKey: MBF,
      // A pairing no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'Singular: Act I + Act II',
      label: 'Singular: both acts',
      group: 'Collections',
      slug: 'singular',
      ...wholeAlbums(['Singular: Act I', 'Singular: Act II']),
      themeKey: 'Singular: Act II',
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
