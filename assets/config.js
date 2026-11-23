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
    { img: 327, t: "Retouching", d: "High-end beauty, fashion and jewelry retouching — skin, fabric, metal and light refined without losing character." },
    { img: 299, t: "Art Direction", d: "Concepts, moodboards and styling direction that turn a brief into one clear visual world." },
    { img: 9, t: "Photography", d: "Campaign, lookbook and test-shoot imagery, shot and edited with a consistent eye." },
    { img: 51, t: "Design & Social", d: "Posters, invitations, LED visuals and social layouts that carry a campaign across every channel." }
  ],

  faq: [
    { q: "What do you offer?", a: "Retouching, art direction, photography support and graphic design for fashion, jewelry and beauty brands — plus event visuals such as posters, invitations and LED content." },
    { q: "How does your process typically work?", a: "It starts with a brief and references, moves into concept and production, then retouching and final delivery in the formats you need — print, web or social." },
    { q: "Are you open to collaboration or freelance work?", a: "Yes. I’m open to new collaborations and freelance projects — send a short brief and we’ll take it from there." },
    { q: "How long does a project take?", a: "It depends on the scope: a set of retouched images is quicker than a full campaign. Share your brief and deadline and I’ll confirm a realistic timeline." }
  ]
};
