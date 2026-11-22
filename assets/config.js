// ───────────────────────────────────────────────────────────────
//  Edit this file to change the personal details on the website.
// ───────────────────────────────────────────────────────────────
window.SITE = {
  name: "Anh Jolie",            // shown in the logo + footer
  firstName: "Anh",             // "Hi, I'm ___"
  roles: ["Retoucher", "Art Director", "Photographer", "Designer"], // rotating word in the hero
  email: "hello@example.com",   // ⚠ replace with your real email
  instagram: "",                // e.g. "https://instagram.com/yourname"  (leave "" to hide)
  behance: "",                  // e.g. "https://behance.net/yourname"    (leave "" to hide)
  phone: "",                    // optional, leave "" to hide
  available: true,              // shows the green "Available" pill in the hero

  // Brand names scrolling under the hero (text only)
  brands: [
    ["JEMMIA", "wide"], ["HUBLOT", "wide"], ["Harper’s BAZAAR", "serif"], ["PNJ", "bold"],
    ["PAULA’S CHOICE", "wide"], ["CAO Fine Jewellery", "serif"], ["ANJO", "bold"],
    ["LÊ THANH HOÀ", "wide"], ["TONNY", "bold"], ["MOORIS", "wide"], ["GLAMDOLL", "serif"],
    ["DATT", "bold"], ["THAT", "wide"], ["NGỌC THẨM", "serif"], ["cocolens", "bold"]
  ],

  // Which project covers appear in the hero + the "recent works" wall
  heroSlug: "anjo",
  avatarSlugs: ["jemmia", "cao-fine", "chi-pu-beauty"],
  wallSlugs: ["jemmia", "hublot", "anjo", "harpers-bazaar", "nhu-nguyet", "cao-fine",
              "le-thanh-hoa", "glamdoll", "dana-phuong-oanh", "mooris", "chi-pu-beauty", "thuy-design"]
};
