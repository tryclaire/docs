import relativeLinksRule from "markdownlint-rule-relative-links";

export default {
  config: {
    default: true,
    MD013: false,
    MD025: { front_matter_title: "" },
    MD060: { style: "compact" },
    "relative-links": true,
  },
  globs: ["README.md", "docs/**/*.md"],
  customRules: [relativeLinksRule],
};
