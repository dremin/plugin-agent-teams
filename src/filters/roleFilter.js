import { AppState, FilterDefinition, FiltersListItemType } from "@twilio/flex-ui";

const options = [
  'Commercial',
  'Retention',
  'Residential'
];

export const roleFilter = (appState) => {
  
  return {
  id: 'data.attributes.routing.skills',
  title: 'Roles',
  fieldName: 'roles',
  type: FiltersListItemType.multiValue,
  options: options.sort().map(value => ({
    value,
    label: value,
    default: false
  })),
  condition: 'IN'
}};
