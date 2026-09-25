import type { Theme } from '../../core/types';

export const ALBUM_THEMES: Record<string, Theme> = {
    "Taylor Swift": {
        className: 'theme-taylor-swift',
    },
    "Fearless": {
        className: 'theme-fearless',
    },
    "Speak Now": {
        className: 'theme-speak-now',
    },
    "Red": {
        className: 'theme-red',
    },
    "1989": {
        className: 'theme-1989',
    },
    "Reputation": {
        className: 'theme-reputation',
    },
    "Lover": {
        className: 'theme-lover',
    },
    "Folklore": {
        className: 'theme-folklore',
    },
    "Evermore": {
        className: 'theme-evermore',
    },
    "Midnights": {
        className: 'theme-midnights',
    },
    "The Tortured Poets Department": {
        className: 'theme-ttpd',
        short_name: "TTPD",
    },
    "The Life Of A Showgirl": {
        className: 'theme-showgirl',
    },
    "The Life Of A Showgirl: The Encore": {
        className: 'theme-showgirl-encore',
        short_name: "The Encore",
        titleEffect: 'stagger',
        titlePrefix: 'The',
        cardSurface: 'glitter',
        // The Showgirl album page opens in the Encore now; the original
        // Showgirl theme stays in the picker.
        forAlbum: 'The Life Of A Showgirl',
        // Rankings shared from this theme preview as a glitter card.
        shareCard: { texture: '/og/encore-glitter.jpg', bg: '#420318', fg: '#D59943' },
        // Sampled from the cover's glitter lettering, dark flakes to the
        // brightest flashes.
        entranceEffect: {
            type: 'glitter',
            colors: ['#A86916', '#B87925', '#D59943', '#F1BC67', '#FDD07C', '#FFF3D6'],
        },
    },
}
