// ───────────────────────────────────────────────────────────────
//  Edit this file to change the personal details and copy on the site.
// ───────────────────────────────────────────────────────────────
window.SITE = {
  name: "Thanh Huyen",          // shown in the title, footer, "© Thanh Huyen 2026"
  nickname: "Jolie",            // used in the About text ("everyone calls me Jolie")
  heroLines: ["I’M THANH HUYEN"],  // giant hero title, one entry per line (the © follows the last line)
  footWord: "JOLIE",            // giant word cropped at the very bottom of the page
  year: 2026,
  roles: ["Retoucher", "Art Director", "Photographer", "Designer"],
  email: "",                    // ⚠ add your real email, e.g. "you@gmail.com" (button stays hidden while empty)
  instagram: "",                // e.g. "https://instagram.com/yourname"  (leave "" to hide)
  behance: "",                  // e.g. "https://behance.net/yourname"    (leave "" to hide)
  phone: "",                    // optional, leave "" to hide
  available: true,

  // [name shown, project it opens]
  brands: [["JEMMIA", "jemmia"], ["HUBLOT", "hublot"], ["Harper’s BAZAAR", "harpers-bazaar"], ["PNJ", "pnj"],
           ["Paula’s Choice", "paulas-choice"], ["CAO Fine Jewellery", "cao-fine"], ["ANJO", "anjo"],
           ["Lê Thanh Hoà", "le-thanh-hoa"], ["TONNY", "tonny-show"], ["MOORIS", "mooris"], ["Glamdoll", "glamdoll"],
           ["DATT", "datt"], ["THAT", "that"], ["Ngọc Thẩm", "ngoc-tham"], ["Cocolens", "cocolens"]],

  // img = photo number from tools/build_images.py (all warm gold/amber to match the yellow theme)
  expertise: [
    { img: 327, slug: "retouching", t: "Retouching",
      blurb: "Skin, fabric, metal and light, refined without losing character — from beauty portraits and jewelry close-ups to before / after retouching pairs.",
      gallery: [72, 76, 73, 77, 74, 78, 64, 66, 68, 70, 80, 84, 88, 90, 92, 94, 95, 100, 102, 103, 348, 350, 346, 242, 266, 286],
      d: "High-end beauty, fashion and jewelry retouching — skin, fabric, metal and light refined without losing character." },
    { img: 299, slug: "art-direction", t: "Art Direction",
      blurb: "Concepts and visual worlds built from a brief — surreal still lifes, fantasy editorials and sculptural fashion stories.",
      gallery: [173, 176, 181, 187, 191, 197, 34, 38, 40, 39, 42, 36, 52, 54, 55, 296, 297, 298, 299, 311, 155, 157, 161, 163, 166],
      d: "Concepts, moodboards and styling direction that turn a brief into one clear visual world." },
    { img: 9, slug: "photography", t: "Photography",
      blurb: "Test shoots, lookbooks and campaign frames — hard light, clean studio sets and painterly backdrops.",
      gallery: [432, 433, 434, 435, 436, 437, 438, 439, 440, 424, 427, 429, 430, 0, 4, 9, 12, 17, 21, 202, 206, 217, 224, 449, 471, 333, 339],
      d: "Campaign, lookbook and test-shoot imagery, shot and edited with a consistent eye." },
    { img: 51, slug: "design-social", t: "Design & Social",
      blurb: "Posters, invitations, LED visuals, storyboards and social layouts that carry a campaign across every channel.",
      gallery: [412, 413, 415, 416, 410, 374, 360, 361, 373, 109, 110, 417, 418, 419, 239, 251, 253, 254, 250, 352, 52, 53, 51],
      d: "Posters, invitations, LED visuals and social layouts that carry a campaign across every channel." }
  ],

  faq: [
    { q: "What do you offer?", a: "Retouching, art direction, photography support and graphic design for fashion, jewelry and beauty brands — plus event visuals such as posters, invitations and LED content." },
    { q: "How does your process typically work?", a: "It starts with a brief and references, moves into concept and production, then retouching and final delivery in the formats you need — print, web or social." },
    { q: "Are you open to collaboration or freelance work?", a: "Yes. I’m open to new collaborations and freelance projects — send a short brief and we’ll take it from there." },
    { q: "How long does a project take?", a: "It depends on the scope: a set of retouched images is quicker than a full campaign. Share your brief and deadline and I’ll confirm a realistic timeline." }
  ]
};
