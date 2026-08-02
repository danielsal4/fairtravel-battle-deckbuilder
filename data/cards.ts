export type CardSeed = {
  name: string;
  slug: string;
  cardNumber: string;
  cost: number;
  type: string;
  subtype?: string | null;
  rarity: string;
  attack?: number | null;
  health?: number | null;
  rulesText: string;
  setCode?: string;
  imageUrl?: string | null;
  color: string[];
  keywords?: string;
  isUnique?: boolean;
  deckLimit?: number | null;
};

export const cards: CardSeed[] = [
  {
    name: 'A Dark Past',
    slug: 'a-dark-past',
    cardNumber: 'FTB-001',
    cost: 0,
    type: 'Quest',
    rarity: 'Common',
    rulesText: 'Quest - If a friendly follower was destroyed since your last turn, pay 2 to draw a card.',
    color: ['Colorless'],
    keywords: 'Quest, Draw, Destroy',
  },

  {
    name: 'Hero Down!',
    slug: 'hero-down',
    cardNumber: 'FTB-002',
    cost: 0,
    type: 'Quest',
    rarity: 'Common',
    rulesText: 'Quest - If a friendly hero has 15HP or less, pay 2 to heal 5HP to target hero.',
    color: ['Colorless'],
    keywords: 'Quest, Heal',
  },

  {
    name: 'Hero Training',
    slug: 'hero-training',
    cardNumber: 'FTB-003',
    cost: 0,
    type: 'Quest',
    rarity: 'Common',
    rulesText: 'Quest - If your hero attacked this turn, pay 2 to draw a card.',
    color: ['Colorless'],
    keywords: 'Quest, Draw',
  },

  {
    name: 'Capital Guard',
    slug: 'capital-guard',
    cardNumber: 'FTB-004',
    cost: 1,
    type: 'Follower',
    subtype: 'Human Soldier',
    rarity: 'Common',
    attack: 1,
    health: 3,
    rulesText: 'Guardian (Defends attacks unless it\'s exhausted)',
    color: ['Blue'],
    keywords: 'Follower, Guardian',
  },

  {
    name: 'Construct Factory',
    slug: 'construct-factory',
    cardNumber: 'FTB-005',
    cost: 1,
    type: 'Artifact',
    subtype: 'Unique, Item',
    rarity: 'Rare',
    rulesText: 'Whenever an artifact enters your support zone, summon a Blue 1/1 Construct artifact follower token.',
    color: ['Blue'],
    keywords: 'Artifact, Item, Token, Unique',
  },

  {
    name: 'Commune with Nature',
    slug: 'commune-with-nature',
    cardNumber: 'FTB-006',
    cost: 1,
    type: 'Spell',
    rarity: 'Common',
    rulesText: 'Draw a card. If you healed a character this turn, draw two instead.',
    color: ['Green'],
    keywords: 'Draw, Heal, Spell',
  },

  {
    name: 'Campfire',
    slug: 'campfire',
    cardNumber: 'FTB-007',
    cost: 2,
    type: 'Artifact',
    subtype: 'Item',
    rarity: 'Common',
    rulesText: 'Deploy (Performs this effect when this is put into play) - Heal 2HP to all friendly characters. At the end of your turn, destroy this and draw a card.',
    color: ['Green'],
    keywords: 'Deploy, Heal, Artifact, Item, Destroy, Draw',
  },

  {
    name: 'Chains',
    slug: 'chains',
    cardNumber: 'FTB-008',
    cost: 2,
    type: 'Enchantment',
    subtype: 'Follower Attachment',
    rarity: 'Common',
    rulesText: 'Attached follower has -4 attack. When the attach of attached follower becomes 0, destroy it.',
    color: ['Black'],
    keywords: 'Enchantment, Follower, Attachment, Destroy',
  },

  {
    name: 'Darkness Sword',
    slug: 'darkness-sword',
    cardNumber: 'FTB-009',
    cost: 2,
    type: 'Artifact',
    subtype: 'Weapon',
    rarity: 'Uncommon',
    attack: 2,
    rulesText: 'Whenever you destroy a follower while you don\'t control a weapon, return this from your discard pile to your support zone.',
    color: ['Black'],
    keywords: 'Artifact, Weapon, Destroy',
  },

  {
    name: 'Lasher Chestplate',
    slug: 'lasher-chestplate',
    cardNumber: 'FTB-010',
    cost: 4,
    type: 'Artifact',
    subtype: 'Armor, Chest',
    rarity: 'Epic',
    health: 3,
    rulesText: 'Whenever your hero takes battle damage as a defender, deal 2 damage to that player\'s hero.',
    color: ['Red'],
    keywords: 'Artifact, Armor, Chest, Damage',
  },

  {
    name: 'Satchel',
    slug: 'satchel',
    cardNumber: 'FTB-011',
    cost: 3,
    type: 'Artifact',
    subtype: 'Unique, Item',
    rarity: 'Rare',
    rulesText: `2, Exhaust (The card turns sideways and can't attack, but is restored at the start of your next turn): 
      Explore (Reveal the top 5 cards of your deck. You may draw a card with the specified criteria, then put the rest on the bottom)
      for an artifact, enchantment, or spell.`,
    color: ['Red'],
    keywords: 'Artifact, Item, Unique, Exhaust, Explore, Enchantment, Spell',
  },

  {
    name: 'Arfactus, Reality Shaper',
    slug: 'arfactus-reality-shaper',
    cardNumber: 'FTB-012',
    cost: 10,
    type: 'Follower',
    subtype: 'Unique, God',
    rarity: 'Legendary',
    attack: 12,
    health: 12,
    rulesText: 
      `Guardian (Defends attacks unless it's exhausted)\n
      Deploy (Performs this effect when this is put into play)\n
      - Deal 1 damage to all opposing heroes for each card in their field and support zone.\n
      - Destroy all opposing followers.\n
      - Destroy all opposing artifacts.\n
      - Destroy all opposing enchantments.\n`,
    color: ['Red', 'Green', 'Blue', 'Black'],
    keywords: 'Follower, God, Unique, Guardian, Deploy, Destroy, Damage',
  },

  /*

  // Red
  {
    name: 'Emberroad Vanguard',
    slug: 'emberroad-vanguard',
    cardNumber: 'FTB-001',
    cost: 1,
    type: 'Traveler',
    subtype: 'Human Warrior',
    rarity: 'Common',
    attack: 2,
    health: 1,
    rulesText: 'When this attacks, it gets +1 attack this turn.',
    flavorText: 'The fastest route is the one cleared by fire.',
    color: 'Red',
    keywords: 'Rush,Warrior',
  },
  {
    name: 'Cinderhoof Courier',
    slug: 'cinderhoof-courier',
    cardNumber: 'FTB-002',
    cost: 2,
    type: 'Companion',
    subtype: 'Beast Courier',
    rarity: 'Common',
    attack: 2,
    health: 2,
    rulesText: 'When played, another Traveler gets +1 attack this turn.',
    color: 'Red',
    keywords: 'Courier,Beast',
  },
  {
    name: 'Blazing Shortcut',
    slug: 'blazing-shortcut',
    cardNumber: 'FTB-003',
    cost: 2,
    type: 'Journey',
    subtype: 'Route',
    rarity: 'Common',
    attack: null,
    health: null,
    rulesText: 'Deal 2 damage to a unit. If you played another Journey this turn, deal 3 instead.',
    color: 'Red',
    keywords: 'Journey,Damage',
  },
  
*/
];