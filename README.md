# HMIS Dictionary
(08/09/2017)

The HMIS Dictionary is made to simplify user access to terminology and details associated with the data model. The application counts 4 panels:
- DataSets
- Search (limited to the aggregated domain as of 1.0.0)
- Programs
- Custom 'Dossiers' (with additional configuration)

NB: HMIS refers to Health Information Management System

## Panels

- **DataSets**: displays the list of sections, data elements and associated category combos
- **Search**: a search tool to access directly data elements (aggregate domain) and indicators
- **Programs**: displays the list of sections, data elements with optionSets, progam indicators, event reports and event charts
- **Dossiers**: displays list of data sets and indicator groups by 'service'
- **Admin**: configuration of the Dossiers panel and 'service' concept

## Configuration

The configuration relies on the following elements that have to be defined through the Maintenance app:
- an *organisationUnitGroupSet* that gather all the elements of the typology of services,
- the typology of services itself, each one is an *organisationUnitGroup* with a unique code: "OUG_HSV_#CODE#", their description are stored in tranlsations (description is only available in translations as of dhis v2.25),
- then *dataSets* and *indicatorGroups* have one attribute, repectively "DS_#CODE1#_#CODE2#..." and "ING_#CODE2#" that permits the direct association with the typology of services (association with multiple services is allowed),
- finally the *dataElements* are associated via the *sections* to the dataSets and the *indicators* are associated directly to the indicatorGroups (*dataElements* outside of *sections* would not appear).
- in *indicators* the descriptions of numerators and denominators cannot be translated (as of dhis v2.25) so the key words "NUM:" and "DENOM:" (both compulsory) are used in *indicators* descriptions (which have a translation).

Some elements are defined at the **Admin** panel:
- The uid of the *organisationUnitGroupSet*
- The name of the group of user with editing right in the **Dossier** panel and the **Admin** panel too
- *dataSets* and *indicatorGroups* can be blacklisted

Some elements are still hardcoded:
- The search panel will not show *dataElements* or *indicators* that are not associated to a *dataSet* or an *indicatorGroup*
- Only *dataElements* in the aggregated domain are currently taken into account: [app/search/search.services.js#L7](https://github.com/msf-ocba/HMIS_Dictionary/blob/master/app/search/search.services.js#L7), [app/search/search.services.js#L11](https://github.com/msf-ocba/HMIS_Dictionary/blob/master/app/search/search.services.js#L11) and [app/search/search.services.js#L14](https://github.com/msf-ocba/HMIS_Dictionary/blob/master/app/search/search.services.js#L14)
- The app is currently available in English, French, Spanish and Portuguese and uses the content of DHIS2 in these 4 languages (as available per MSF OCBA configuration): [app/app.config.js#L60](https://github.com/msf-ocba/HMIS_Dictionary/blob/master/app/app.config.js#L60), [app/dossiersEditor/dossiersEditor.controllers.js#L44](https://github.com/msf-ocba/HMIS_Dictionary/blob/master/app/dossiersEditor/dossiersEditor.controllers.js#L44) and [languages/](https://github.com/msf-ocba/HMIS_Dictionary/tree/master/languages).
  
## Feedback

hmis@barcelona.msf.org
