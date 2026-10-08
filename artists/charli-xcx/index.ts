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

const REMIX_ALBUM = 'Brat and it’s completely different but also still brat';

// Her studio albums; the Number 1 Angel and Pop 2 mixtapes and the Wuthering
// Heights soundtrack stand apart.
const STUDIO_ALBUMS = ['True Romance', 'Sucker', 'Charli', "how i'm feeling now", 'Crash', 'Brat', 'Music, Fashion, Film'];
const MIXTAPES = ['Number 1 Angel', 'Pop 2'];

export const CharliXcxConfig: ArtistConfig = {
  id: 'charli-xcx',
  name: 'Charli xcx',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Brat',
  storageKey: 'charli-xcx-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Sucker's Red Balloon, Crash's and Brat's deluxe songs and Music,
    // Fashion, Film's B-sides.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Vroom Vroom, Paradise, Trophy and Secret (Shh).
    { label: 'Vroom Vroom EP', variants: ['EP'] },
    { label: 'Singles', variants: ['Singles'] },
    // Hot Girl (Bodies Bodies Bodies) and Barbie's Speed Drive.
    { label: 'Soundtracks', variants: ['Soundtracks'] },
    // Brat and it's completely different but also still brat.
    { label: 'Brat remixes', variants: ['Remix'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Left out until someone opts in: the Brat remixes and the songs where
  // she shares the billing on someone else's record.
  defaultExcludedVariants: [`${REMIX_ALBUM}:Remix`, 'Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Charli xcx song, from True Romance and Sucker to Pop 2, Crash, Brat and Music, Fashion, Film. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Charli xcx Album Song | Charli xcx Song Sorter',
        description: 'Rank the songs from True Romance, Sucker, Charli, how i\'m feeling now, Crash, Brat and Music, Fashion, Film together, deluxe tracks included, two at a time.',
      },
      'The Mixtapes': {
        title: 'Rank Number 1 Angel and Pop 2 | Charli xcx Song Sorter',
        description: 'Rank the songs from Charli xcx\'s mixtapes Number 1 Angel and Pop 2, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Charli xcx Song | Charli xcx Song Sorter',
        description: 'Rank every Charli xcx song: every album, mixtape and deluxe track, single, soundtrack song, Brat remix and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Charli xcx Album Tracks Only | Charli xcx Song Sorter',
        description: "Rank the standard tracklists of Charli xcx's albums and mixtapes, without deluxe tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Charli xcx's Non-Album Songs | Charli xcx Song Sorter",
        description: 'Rank the Charli xcx songs outside her records, from Boys and Vroom Vroom to Speed Drive and Hot In It, two at a time.',
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
      name: 'The Mixtapes',
      label: 'Mixtapes',
      group: 'Collections',
      slug: 'mixtapes',
      ...forAlbums(MIXTAPES, [STANDARD_VARIANT]),
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
