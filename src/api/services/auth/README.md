# Admin Authentication Integration

Go backend authentication system integrated with existing Axios patterns.

## What Was Implemented

### 1. Service Layer (`admin-auth.api.ts`)
- `adminLogin(username, password)` - Admin user login
- `adminRefreshToken(refreshToken)` - Refresh access token
- `adminLogout(refreshToken)` - Logout and revoke token
- `createAdminUser(params)` - Create new admin user (requires auth)

All functions follow existing patterns:
- Use `withBody()` to inject base audit fields
- Use `validateApiResponse()` for error handling
- Use Axios client for HTTP requests

### 2. React Query Hooks (`admin-auth.hooks.ts`)
- `useAdminLogin()` - Login mutation with token storage
- `useAdminRefreshToken()` - Token refresh mutation
- `useAdminLogout()` - Logout mutation with cleanup
- `useCreateAdminUser()` - Create admin mutation

All hooks include:
- Toast notifications (sonner)
- Query invalidation
- Token storage in localStorage
- Error handling

### 3. Auth Store Updates (`stores/authStore.ts`)
Added `adminAuth` section to Zustand store:
- `user: AdminUserInfo | null` - Current admin user
- `refreshToken: string | null` - Refresh token
- `setUser(user)` - Update admin user
- `setTokens(accessToken, refreshToken)` - Store tokens
- `clearAuth()` - Clear all auth data

Maintains backward compatibility with existing `auth` section.

### 4. Axios Interceptor (`http/client.ts`)
Automatic token refresh on 401 errors:
- Intercepts 401 responses
- Refreshes token automatically
- Queues failed requests during refresh
- Retries original request with new token
- Clears auth on refresh failure

### 5. Endpoint Constants (`constant-routes.ts`)
```typescript
ADMIN_AUTH_LOGIN = "/admin/auth/login"
ADMIN_AUTH_REFRESH = "/admin/auth/refresh"
ADMIN_AUTH_LOGOUT = "/admin/auth/logout"
ADMIN_USERS_CREATE = "/admin/users/create"
```

## Usage Examples

### Login Component
```typescript
import { useAdminLogin } from '@/api/services/auth';
import { useAuthStore } from '@/stores/authStore';

function LoginForm() {
  const loginMutation = useAdminLogin();
  const { setUser, setTokens } = useAuthStore(state => state.adminAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginMutation.mutateAsync({
        username: 'admin',
        password: 'password123'
      });

      // Tokens are automatically stored by the hook
      // Update Zustand store
      if (result.data.user) {
        setUser(result.data.user);
      }
      setTokens(result.data.accessToken, result.data.refreshToken);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the hook (toast notification)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Logout Component
```typescript
import { useAdminLogout } from '@/api/services/auth';
import { useAuthStore } from '@/stores/authStore';

function LogoutButton() {
  const logoutMutation = useAdminLogout();
  const clearAuth = useAuthStore(state => state.adminAuth.clearAuth);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      clearAuth();
      navigate('/login');
    } catch (error) {
      // Error handled by hook
      clearAuth(); // Clear anyway
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

### Protected Route
```typescript
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from '@tanstack/react-router';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const adminUser = useAuthStore(state => state.adminAuth.user);
  const hasToken = localStorage.getItem('ACCESS_TOKEN_KEY');

  if (!adminUser || !hasToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

### Check Permissions
```typescript
import { useAuthStore } from '@/stores/authStore';

function AdminPanel() {
  const adminUser = useAuthStore(state => state.adminAuth.user);

  const hasPermission = (permission: string) => {
    return adminUser?.permissions.includes(permission) ?? false;
  };

  return (
    <div>
      {hasPermission('admin.manage') && (
        <button>Manage Users</button>
      )}
      {hasPermission('documents.write') && (
        <button>Create Document</button>
      )}
    </div>
  );
}
```

## Storage Keys

- `ACCESS_TOKEN_KEY` - JWT access token
- `REFRESH_TOKEN_KEY` - JWT refresh token
- `ADMIN_USER_INFO` - Serialized AdminUserInfo object
- `ID_SESSION_KEY` - Session ID (from existing pattern)
- `ID_DEVICE_KEY` - Device ID (from existing pattern)

## Type Safety

All types are imported from `@/api/frontend-types`:
- `AdminUserInfo` - User info response
- `TokenPairResponse` - Token pair with user
- `LoginRequest` - Login request payload
- `RefreshTokenRequest` - Refresh request payload
- `LogoutRequest` - Logout request payload
- `CreateAdminRequest` - Create admin request payload

## Error Handling

All API errors are caught and handled:
1. Toast notifications show user-friendly messages
2. Auth store is cleared on auth failures
3. Axios interceptor handles 401 automatically
4. Failed requests are retried after token refresh

## Security Features

- Token rotation on refresh (new access + refresh tokens)
- Automatic token refresh before expiration (via interceptor)
- Refresh token revocation on logout
- Request queuing during token refresh
- Device and session tracking via IBase fields
- IP address logging (set by backend)
