
export interface NFTMetadata {
  name: string;
  description: string;
  traits: {
    trait_type: string;
    value: string;
  }[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
  metadata: NFTMetadata;
}

export enum NFTStyle {
  BORED_APE = 'Bored Ape Yacht Club Style',
  CARTOON_CREATURE = 'Vibrant Cartoon Creature',
  CUTE_ANIMAL = 'Minimalist Chibi Penguin',
  PIXEL_ART = 'Retro 8-Bit Pixel Punk'
}

export const ASPECT_RATIOS = ["1:1"];
