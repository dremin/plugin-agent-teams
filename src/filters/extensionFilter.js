import React from 'react';

import { FreeTextFilter, FreeTextFilterLabel } from '../components/FreeTextFilter';

export const extensionFilter = () => ({
  id: 'data.attributes.full_name',
  fieldName: 'directExtension',
  title: 'Extension',
  customStructure: {
    field: <FreeTextFilter />,
    label: <FreeTextFilterLabel />
  },
  condition: 'CONTAINS'
})
