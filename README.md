# Agent Teams Views Example Flex Plugin

In Flex, workers with only the agent role cannot access the Teams view. Hacking the Teams view in results in some weird/crashy behavior, so an alternative approach is needed. This plugin adds two views to the side nav for agent users, "Agent Teams" and "Agent Teams Simple."

"Agent Teams" uses the Flex-provided components for the teams data table and the teams filter panel. Custom logic is used to load worker data from Sync and to form queries based on selected filters. This allows existing function-based Teams view filters to be used in the plugin by passing them to the `filters` prop of `AgentTeamsViewComponent`.

"Agent Teams Simple" uses the Flex-provided component for the teams data table, and uses Flex logic for loading and filtering workers in the table. However, this view does not support complex Teams view filters, instead filters can be defined ahead-of-time by setting `flex.WorkersDataTable.defaultProps.filters`.

## Limitations

- The "Agent Teams" view current filter is stored in state, but the filters panel does not use that state, so the components get out of sync when navigating to other pages and coming back. This could be worked around by not saving the filter into state, but then the filter is lost every time the user navigates to another page.
- Switching between "Agent Teams" and "Agent Teams Simple" pages causes weird behavior because they share some state in Flex. To avoid this, reload Flex when switching between these two pages.

## Disclaimer

**This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.**
