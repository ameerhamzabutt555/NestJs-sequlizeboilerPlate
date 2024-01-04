// Import data from various files and re-export them
export { permissions } from './permissions.data.js'; // Exports permissions data
export { roles } from './roles.data.js'; // Exports roles data

// Import default permissions for different user roles and re-export them
export {
  superAdminPermissions,
  OrgAdminPermissions,
  guestPermissions
} from './default-permissions.data.js';
