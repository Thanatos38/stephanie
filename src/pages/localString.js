import { defineType } from "sanity";

export default defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    { name: "en", type: "string", title: "English" },
    { name: "fr", type: "string", title: "French" },
    { name: "de", type: "string", title: "German" },
    { name: "es", type: "string", title: "Spanish" },
    { name: "it", type: "string", title: "Italian" },
    { name: "nl", type: "string", title: "Dutch" },
    { name: "pt", type: "string", title: "Portuguese" }
  ]
});


