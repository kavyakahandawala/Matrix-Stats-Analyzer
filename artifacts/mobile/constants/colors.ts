/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#152A2B',
    tint: '#087E78',
    background: '#F3F8F6',
    foreground: '#152A2B',
    card: '#FFFFFF',
    cardForeground: '#152A2B',
    primary: '#087E78',
    primaryForeground: '#FFFFFF',
    secondary: '#E7F0ED',
    secondaryForeground: '#254344',
    muted: '#EAF1EF',
    mutedForeground: '#687D7A',
    accent: '#D9F2EC',
    accentForeground: '#075C57',
    destructive: '#B94343',
    destructiveForeground: '#FFFFFF',
    border: '#D9E5E1',
    input: '#D9E5E1',
  },
  dark: {
    text: '#EAF4F1',
    tint: '#5ADBC3',
    background: '#0B1516',
    foreground: '#EAF4F1',
    card: '#142122',
    cardForeground: '#EAF4F1',
    primary: '#5ADBC3',
    primaryForeground: '#09201D',
    secondary: '#1B2C2D',
    secondaryForeground: '#D3E4E0',
    muted: '#1A292A',
    mutedForeground: '#91A8A3',
    accent: '#1A3935',
    accentForeground: '#8BE9D6',
    destructive: '#F17979',
    destructiveForeground: '#241010',
    border: '#2A3C3C',
    input: '#2A3C3C',
  },

  radius: 16,
};

export default colors;
