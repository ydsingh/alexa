// when submitting a PR, be sure to complete the appropriate section
// also, consider opening an issue to discuss the contribution
//
// sections:
// - issue related (including patch/bug fix)
// - feature demo
// - resource
// - guide
// You can remove any sections not applicable.

// *** Issue section ***
*Issue #, if available:*

*Description of changes:*

// *** Feature Demo section ***
*Issue #, if one was opened:*

*Feature being demonstrated:*

## Checklist for Feature Demo
- [ ] Checked that an existing feature demo does not already exist
- [ ] .ask/config file (normally unmodified [template](../resources/cookbook-templates/config))
- [ ] skill.json
  - [ ] Includes en-US section
  - [ ] Includes Lambda endpoint section including uri
  - [ ] Does not include Privacy and Compliance section
- [ ] Readme.md with description and instructions based on this [template](../resources/cookbook-template/feature-demo-README.md)
- [ ] en-US.json language model (other locales optional)
  - [ ] invocation name includes the word 'demo' (for en-US)
- [ ] skill code written in node.js, python or java (node.js and python preferred since java requires additional setup)
- [ ] adheres to any applicable [code style guidelines](../guides/style)
- [ ] Does not include excess functionality not required to demonstrate the feature

// *** Resource section ***

*Name of new resource:*
*Type of resource:*
- [ ] Intent
- [ ] Slot
- [ ] Other (Note: It is recommended to open an issue first, to ensure the type can be accepted and to determine requirements)
    Please specify:

## Checklist for Intent Resource type
- [ ] Checked that it does not duplicate an existing built-in intent or one already in the Cookbook
- [ ] en-US.json language model (other locales optional)
- [ ] Intent name is prefixed with `COOKBOOK.`
- [ ] Includes 20+ (quality) sample utterances
- [ ] reference/link to typical slot types used with intent (if any)
- [ ] Includes 5+ prompts and 5+ sample utterances for slot elicitation. (Prompts and sample utterances should include references to associated slots.)
- [ ] Includes 5+ slot validation prompts (including references to associated slot values)
- [ ] Includes a description/link in the applicable resource directory file.

## Checklist for Slot Resource type
- [ ] Checked that it does not duplicate an existing built-in slot type or one already in the Cookbook
- [ ] en-US.json language model (other locales optional)
- [ ] Slot Type Name is prefixed with `COOKBOOK.`
- [ ] Includes id's
- [ ] Includes synonyms
- [ ] Includes a description/link in the applicable resource directory file.

// *** Guide section ***

## Checklist for Guide
- [ ] Checked that it does not duplicate an existing guide or the ASK product documentation
- [ ] Focuses on the steps to accomplish a task
- [ ] Does not utilize practices which would prevent certification
- [ ] Addresses all supported locales (excluding translations)
- [ ] Includes a description/link in the applicable guide directory file.

## Tests/checks which any code/configuration submission will need to pass
- [ ] Does not utilize practices which would prevent certification
- [ ] `ask deploy` successfully deploys skill and is ready for use
  > setup steps which are not achievable through the ASK CLI are exempted from this requirement
  > If multiple runtime languages are included, skill.json should use node.js or python version. 
- [ ] Works in all locales for which interaction models have been supplied
- [ ] Works on all devices (including simulator) which support any required features (special requirements must be called out in the README)
- [ ] Documents any dependencies in the README
- [ ] PR does not include any code dependencies (just includes the package.json, pom.xml, etc.)

// * * * * * * * * * * * *
// Do not delete the following section or your PR will be closed without comment.

By submitting this pull request, I confirm that you can use, modify, copy, and redistribute this contribution, under the terms of your choice.
