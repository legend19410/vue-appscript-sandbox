const CONFIG = {
  CACHE:{
    PERMISSIONS_TTL: 21600
  },
  USERS:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    SHEET_NAME: 'Users',
    ID_COUNT_SHEET_NAME: 'UserIdCount',
    DEFAULT_EXCLUDES: ['passwordHash', 'passwordSalt', 'refreshToken']
  },
  USER_ROLES:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    SHEET_NAME: 'UserRoles'
  },
  CUSTOMERS:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    SHEET_NAME: 'Customers',
    ID_COUNT_SHEET_NAME: 'CustomerIdCount',
    DEFAULT_EXCLUDES: [],
  },
  CUSTOMER_REQUESTS:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    SHEET_NAME: 'CustomerRequests',
    ID_COUNT_SHEET_NAME: 'CustomerRequestsIdCount',
    DEFAULT_EXCLUDES: [],
  },
  ENDPOINT_PERMISSIONS:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    SHEET_NAME: 'EndpointPermissions',
  },
  ROLE_PERMISSIONS:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    SHEET_NAME: 'RolePermissions',
  },
  AUTH:{
    JWT_SECRET: "your-256-bit-secret", //your-256-bit-secret
    JWT_EXP_TIME_IN_SECONDS: 3600, // expires in 1 hour
  },
  DATABASE_SETTINGS:{
    SHEET_ID: '1hPLGcnapm26YJbYa3vVvkB3_3YEnjxzWkHPO04s2oyU',
    TABLE_CONFIG_SHEET_NAME: '_Table_Config_'
  },
  NAVIGATION_DROPDOWN:[
    {
        groupTitle: 'Customers',
        path: 'customers',
        icon: 'mdi-account-multiple',
        listItem: [
          { title: 'All Customers', path: 'all-customers' },
          { title: 'Customer Requests', path: 'customer-requests' }
        ],
      },
      {
        groupTitle: 'Invitations',
        path: 'invitations',
        icon: 'mdi-send',
        listItem: [
          { title: 'Send Invitation', path: 'send-invitation' },
          { title: 'Manage Invitation', path: 'manage-invitation' },
        ],
      },
      {
        groupTitle: 'Users',
        path: 'users',
        icon: 'mdi-account-group',
        listItem: [
          { title: 'All Users', path: 'all-users' },
          { title: 'Assign Roles', path: 'assign-roles' },
          { title: 'Create User', path: 'create-user' },
          { title: 'Deactivate User', path: 'deactivate-user' },
        ],
      },
      {
        groupTitle: 'Roles & Permissions',
        path: 'roles-permissions',
        icon: 'mdi-shield-account',
        listItem: [
          { title: 'Roles', path: 'all-roles' },
          { title: 'Create Roles', path: 'create-roles' },
          { title: 'Assign Permissions to Roles', path: 'assign-permissions' },
          { title: 'Permission List', path: 'permission-list' },
        ],
      },
      {
        groupTitle: 'Access Control',
        path: 'access-control',
        icon: 'mdi-lock-outline',
        listItem: [
          { title: 'Access Logs', path: 'access-logs' },
          { title: 'Login History', path: 'login-history' },
          { title: '2FA Settings', path: '2fa-settings' },
          { title: 'Password Policy Settings', path: 'password-policy' },
        ],
      },
      {
        groupTitle: 'Reports & Monitoring',
        path: 'reports',
        icon: 'mdi-file-document',
        listItem: [
          { title: 'Account Creation Trends', path: 'account-trends' },
          { title: 'User Activity Report', path: 'user-activity-report' },
          { title: 'Login Attempt Summary', path: 'login-summary' },
          { title: 'Permission Usage Stats', path: 'permission-usage' },
        ],
      },
      {
        groupTitle: 'Settings & Configurations',
        path: 'settings',
        icon: 'mdi-settings',
        listItem: [
          { title: 'System Settings', path: 'system-settings' },
          { title: 'Security Settings', path: 'security-settings' },
          { title: 'Reset Passwords', path: 'reset-passwords' },
        ],
      }
  ]
  

}
