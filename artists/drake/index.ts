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

// Each edition's added tracks: deluxe and bonus tracks, For All The Dogs'
// Scary Hours Edition and HABIBTI's FOMO songs.
const DELUXE = ['Deluxe', 'Scary Hours Edition', 'FOMO'];

const STUDIO_ALBUMS = ['Thank Me Later', 'Take Care', 'Nothing Was the Same', 'Views', 'Scorpion',
  'Certified Lover Boy', 'Honestly, Nevermind', 'For All The Dogs', 'ICEMAN', 'MAID OF HONOUR', 'HABIBTI'];
// The mixtape, the commercial mixtapes, the playlist and the compilation.
const MIXTAPES = ['So Far Gone', "If You're Reading This It's Too Late", 'More Life', 'Care Package', 'Dark Lane Demo Tapes'];
// With Future, 21 Savage and PARTYNEXTDOOR.
const COLLABORATIONS = ['What a Time to Be Alive', 'Her Loss', '$ome $exy $ongs 4 U'];
// Released together on May 15, 2026.
const TRILOGY = ['ICEMAN', 'MAID OF HONOUR', 'HABIBTI'];

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => DELUXE.includes(v) || v === 'Bonus')));

export const DrakeConfig: ArtistConfig = {
  id: 'drake',
  name: 'Drake',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Take Care',
  storageKey: 'drake-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    { label: 'Deluxe', variants: DELUXE },
    // Views' Hotline Bling.
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Singles where he is a guest or shares the billing rather than leads.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The 6',
  topSectionCount: 6,
  seo: {
    description: 'Rank every Drake song, from So Far Gone, Take Care and Nothing Was the Same to Views, Scorpion, For All The Dogs and ICEMAN. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'ICEMAN + MAID OF HONOUR + HABIBTI': {
        title: 'Rank ICEMAN, MAID OF HONOUR + HABIBTI | Drake Song Sorter',
        description: "Rank the three albums Drake released on May 15, 2026 together, HABIBTI's FOMO songs included, from Make Them Pay and What Did I Miss? to Which One and Cold Shoulder, two at a time.",
      },
      'The Studio Albums': {
        title: 'Rank Every Drake Studio Album Song | Drake Song Sorter',
        description: "Rank the songs from Drake's studio albums, Thank Me Later to HABIBTI, with their deluxe tracks, two at a time.",
      },
      'The Mixtapes & Playlists': {
        title: 'Rank Drake Mixtape & Playlist Songs | Drake Song Sorter',
        description: "Rank So Far Gone, If You're Reading This It's Too Late, More Life, Care Package and Dark Lane Demo Tapes together, two at a time.",
      },
      'The Collaborative Albums': {
        title: 'Rank Drake\'s Collaborative Albums | Drake Song Sorter',
        description: 'Rank What a Time to Be Alive with Future, Her Loss with 21 Savage and $ome $exy $ongs 4 U with PARTYNEXTDOOR together, two at a time.',
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Drake Deluxe & Bonus Tracks | Drake Song Sorter',
        description: "Rank Drake's deluxe and bonus tracks, from The Motto and Hotline Bling to For All The Dogs' Scary Hours Edition and HABIBTI's FOMO songs, two at a time.",
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Drake Song | Drake Song Sorter',
        description: 'Rank every Drake song: every album, mixtape, deluxe track, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Drake Album Tracks Only | Drake Song Sorter',
        description: "Rank the standard tracklists of Drake's albums and mixtapes, without deluxe or bonus tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Drake's Non-Album Songs | Drake Song Sorter",
        description: 'Rank the Drake songs outside his albums, from Back to Back, Summer Sixteen and Laugh Now Cry Later to Family Matters, plus his features, two at a time.',
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
      name: 'ICEMAN + MAID OF HONOUR + HABIBTI',
      label: 'The 2026 albums',
      group: 'New',
      slug: 'iceman-maid-of-honour-habibti',
      ...wholeAlbums(TRILOGY),
      themeKey: 'ICEMAN',
      // A set no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'The Studio Albums',
      label: 'Studio albums',
      group: 'Collections',
      slug: 'studio-albums',
      ...wholeAlbums(STUDIO_ALBUMS),
      indexable: true,
    },
    {
      name: 'The Mixtapes & Playlists',
      label: 'Mixtapes & playlists',
      group: 'Collections',
      slug: 'mixtapes-and-playlists',
      ...wholeAlbums(MIXTAPES),
      indexable: true,
    },
    {
      name: 'The Collaborative Albums',
      label: 'Collaborative albums',
      group: 'Collections',
      slug: 'collaborative-albums',
      ...wholeAlbums(COLLABORATIONS),
      indexable: true,
    },
    {
      name: 'Deluxe & Bonus Tracks',
      label: 'Deluxe & bonus only',
      group: 'Collections',
      slug: 'deluxe-and-bonus-tracks',
      ...forAlbums(EXTRAS, [...DELUXE, 'Bonus']),
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
