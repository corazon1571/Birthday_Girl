/**
 * ====================================================================
 * 💜 ENCHANTED LAVENDER BIRTHDAY CONFIGURATION & LOVE NOTES 💜
 * ====================================================================
 * You can edit all details below!
 * - Change the names, date, envelope titles, letters, and memories.
 * - Any changes here will instantly update the web app.
 * - You can also edit these directly inside the app using the "Customize" button!
 */

window.BIRTHDAY_DATA = {
  // 💜 Recipient Information
  recipientName: "My Love",
  partnerName: "Yours Always",
  birthdayDate: "2026-10-18", // YYYY-MM-DD
  subtitleMessage: "Wishing the most beautiful soul the happiest birthday. You make every day bloom in shades of wonder.",

  // 🎵 Audio Settings (Default romantic acoustic melody is generated in real-time, or you can paste an MP3 audio URL here)
  customMusicUrl: "", // e.g. "https://example.com/your-song.mp3" (leave empty for built-in romantic melody)
  musicTitle: "A Melody For You ♫",

  // 💌 The Envelopes & Cards
  envelopes: [
    {
      id: "envelope-1",
      number: "01",
      tag: "Open First",
      title: "The Story of You",
      subtitle: "A love letter for your special day",
      sealColor: "#7c3aed", // Royal Amethyst
      flowerIcon: "🌸",
      stampText: "FIRST LOVE",
      preview: "Before this day begins, I wanted to tell you how deeply you mean to me...",
      content: {
        salutation: "My Dearest,",
        paragraphs: [
          "Happy Birthday to the one who makes my heart skip a beat and makes every quiet moment feel like poetry.",
          "From the moment you came into my life, everything took on softer edges and brighter colors. You bring so much tenderness, warmth, and grace into the world—just like a quiet garden in full bloom after a gentle rain.",
          "Today is all about celebrating you: your kind laugh, your brilliant mind, the gentle way you care for people, and the beautiful light you bring wherever you go.",
          "I hope this year wraps you in peace, brings you closer to your wildest dreams, and reminds you every day how truly cherished you are."
        ],
        closing: "With all my heart and all my love,",
        signature: "Yours, always & forever ♡"
      }
    },
    {
      id: "envelope-2",
      number: "02",
      tag: "Reasons Why",
      title: "Little Things I Adore",
      subtitle: "Ten little things that make you magical",
      sealColor: "#9333ea", // Wisteria Violet
      flowerIcon: "💜",
      stampText: "REASONS",
      preview: "All the little things about you that I carry in my heart...",
      content: {
        salutation: "Ten Reasons Why You Are My Favorite Human:",
        reasons: [
          { emoji: "✨", title: "The way your eyes crinkle", desc: "Whenever you laugh at something truly funny." },
          { emoji: "🌸", title: "Your love for flowers", desc: "How you stop to admire little blossoms along the sidewalk." },
          { emoji: "☕", title: "Our quiet mornings", desc: "Sitting together with coffee, where silence never feels empty." },
          { emoji: "🤍", title: "Your gentle kindness", desc: "The way you always think about how other people feel." },
          { emoji: "🎶", title: "Your little happy dances", desc: "When your favorite food arrives or a song you love starts playing." },
          { emoji: "📖", title: "Your curious mind", desc: "How passionately you talk about things you love and learn." },
          { emoji: "🫂", title: "Your warm hugs", desc: "The safest, coziest place in the entire world." },
          { emoji: "🌙", title: "Late-night conversations", desc: "Whispering our thoughts until we both drift to sleep." },
          { emoji: "💫", title: "Your unwavering strength", desc: "How resilient, graceful, and inspiring you are every day." },
          { emoji: "💜", title: "Simply being you", desc: "Because you are my favorite miracle." }
        ],
        closing: "And a million more reasons I discover every day.",
        signature: "Forever admiring you ♡"
      }
    },
    {
      id: "envelope-3",
      number: "03",
      tag: "Wishes",
      title: "Garden of Wishes",
      subtitle: "Blessings and wishes for your new year",
      sealColor: "#a855f7", // Glowing Lavender
      flowerIcon: "🌸",
      stampText: "BLESSINGS",
      preview: "Every petal in this garden carries a wish for your journey ahead...",
      content: {
        salutation: "My Birthday Wishes For You:",
        paragraphs: [
          "May this year give you as much joy as you give everyone around you.",
          "May you never doubt how capable, beautiful, and deeply deserving of good things you are.",
          "May you discover new places that take your breath away, read books that awaken your spirit, and have coffee dates filled with unstoppable giggles.",
          "And in moments when life feels overwhelming, may you remember that you have someone in your corner who will never stop cheering for you, believing in you, and holding your hand."
        ],
        closing: "May all your secret wishes blossom into reality.",
        signature: "With endless blessings ♡"
      }
    },
    {
      id: "envelope-4",
      number: "04",
      tag: "Memories",
      title: "Our Polaroid Album",
      subtitle: "Snapshots of sweet moments together",
      sealColor: "#6d28d9", // Deep Twilight Violet
      flowerIcon: "💐",
      stampText: "MEMORIES",
      preview: "Little moments that became my fondest memories...",
      content: {
        salutation: "A Few of My Favorite Memories With You:",
        memories: [
          {
            title: "Lavender Fields at Sunset",
            date: "Summer Evening",
            caption: "The twilight sky was purple and gold, but I couldn't stop looking at you.",
            colorGradient: "linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)",
            icon: "🌸"
          },
          {
            title: "Flower Market Stroll",
            date: "Spring Morning",
            caption: "Watching you light up picking fresh blooms and fragrant lavender.",
            colorGradient: "linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%)",
            icon: "🌷"
          },
          {
            title: "Cozy Rainy Day",
            date: "Autumn Afternoon",
            caption: "Hot tea, soft blankets, gentle raindrops against the window with you.",
            colorGradient: "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)",
            icon: "🌧️"
          },
          {
            title: "Under The City Lights",
            date: "Winter Night",
            caption: "Hands held tight in coat pockets, walking nowhere in particular.",
            colorGradient: "linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)",
            icon: "✨"
          }
        ],
        closing: "Here is to filling hundreds more albums together.",
        signature: "Every chapter with you is my favorite ♡"
      }
    },
    {
      id: "envelope-5",
      number: "05",
      tag: "Promise",
      title: "Love Vouchers & Promises",
      subtitle: "Little promises you can redeem anytime",
      sealColor: "#8b5cf6", // Soft Lavender
      flowerIcon: "🌺",
      stampText: "COUPONS",
      preview: "Redeemable anytime, no expiration date...",
      content: {
        salutation: "Birthday Promise Cards (Redeemable Forever):",
        coupons: [
          { title: "One Big Surprise Flower Bouquet", code: "BLOOM-01", desc: "Fresh flowers delivered with a handwritten note of love." },
          { title: "Romantic Candlelight Dinner Date", code: "DINNER-02", desc: "At your favorite restaurant or a homemade 3-course dinner." },
          { title: "Unconditional Head Scratches & Massage", code: "RELAX-03", desc: "30 minutes of complete pampering after a long tiring day." },
          { title: "One 'You Pick Everything' Movie Night", code: "CINEMA-04", desc: "Your choice of movie, snacks, and unlimited cuddles." },
          { title: "Spontaneous Weekend Getaway", code: "ESCAPE-05", desc: "A cozy trip to anywhere you want to explore." }
        ],
        closing: "Valid indefinitely. Just show me this card!",
        signature: "Sealed with a pinky promise ♡"
      }
    },
    {
      id: "envelope-6",
      number: "06",
      tag: "Celebration",
      title: "Make a Birthday Wish",
      subtitle: "Blow the candles & make a secret wish",
      sealColor: "#7e22ce", // Enchanted Amethyst
      flowerIcon: "🎂",
      stampText: "WISH 2026",
      preview: "An interactive birthday cake waiting just for you...",
      content: {
        isCakeCard: true,
        salutation: "Close Your Eyes & Make a Wish!",
        instruction: "Tap the candles to blow them out and reveal your birthday surprise!",
        revealedMessage: "May every single wish you made in your heart come true this year! You deserve all the stars in the night sky. Happy Birthday! 🎉💜"
      }
    }
  ],

  // 💐 Interactive Bouquet Builder Flowers & Meanings
  bouquetFlowers: [
    {
      id: "lavender",
      name: "Provence Lavender",
      symbolism: "Serenity, Grace & Peace",
      color: "#a855f7",
      icon: "🌸",
      quote: "Calming, fragrant, and gentle—reminding me of how peaceful the world feels with you."
    },
    {
      id: "wisteria",
      name: "Enchanted Wisteria",
      symbolism: "Devotion & Lifelong Love",
      color: "#c084fc",
      icon: "🍇",
      quote: "Cascading purple blooms representing deep affection and sweet memories."
    },
    {
      id: "orchid",
      name: "Velvet Purple Orchid",
      symbolism: "Rare Beauty & Charm",
      color: "#9333ea",
      icon: "🌸",
      quote: "Exotic and mesmerizing, just like your radiant smile."
    },
    {
      id: "peony",
      name: "Lilac Peonies",
      symbolism: "Romance & Good Fortune",
      color: "#d8b4fe",
      icon: "🌺",
      quote: "Lush petals overflowing with love, joy, and blessings for your year."
    },
    {
      id: "violet",
      name: "Sweet Garden Violets",
      symbolism: "Faithfulness & Loyalty",
      color: "#7e22ce",
      icon: "💐",
      quote: "Delicate and true, carrying my promise to always cherish you."
    },
    {
      id: "babysbreath",
      name: "Baby's Breath",
      symbolism: "Everlasting Love",
      color: "#f3e8ff",
      icon: "✨",
      quote: "Tiny constellations of blossoms that whisper forever."
    }
  ]
};
