import { permissions } from './index.js';

// Define `superAdminPermissions` as an array containing all values from the `permissions` object.
const superAdminPermissions = Object.values(permissions);

// Define `OrgAdminPermissions` as an array containing all values from the `permissions` object.
const OrgAdminPermissions = Object.values(permissions);

// Define `guestPermissions` as an array of specific permission values.
const guestPermissions = [
  'ADM_CUSTOMER_VIEW',
  'ADM_CUSTOMER_VIEW_DETAIL',
  // ... (add more permissions here)
  'CONSTRUCTION_DIARY_VIEW'
];

// Export the defined arrays for later use.
export { superAdminPermissions, OrgAdminPermissions, guestPermissions };
