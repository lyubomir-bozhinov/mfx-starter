import React from 'react';
import { useAuthStore } from '@mfx/shared-utils';

export interface RoleGateProps {
  roles: string[];
  mode?: 'any' | 'all';
  fallback?: React.ComponentType<{ missingRoles: string[] }>;
  children: React.ReactNode;
  className?: string;
}

const DefaultFallback: React.FC<{ missingRoles: string[] }> = ({ missingRoles }) => (
  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <div className="text-center">
      <div className="text-gray-400 mb-2">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8V9a3 3 0 00-3-3H7a3 3 0 00-3 3v2m0 0v6a2 2 0 002 2h10a2 2 0 002-2v-6m0 0H5"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">Access Restricted</h3>
      <p className="text-sm text-gray-500">
        You need additional permissions to view this content.
      </p>
      {missingRoles.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          Required roles: {missingRoles.join(', ')}
        </p>
      )}
    </div>
  </div>
);

/**
 * Role-based access control component
 * Conditionally renders children based on user roles from auth store
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  roles,
  mode = 'any',
  fallback: FallbackComponent = DefaultFallback,
  children,
  className,
}) => {
  const userRoles = useAuthStore(state => state.userRoles);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  // If not logged in, show fallback
  if (!isLoggedIn) {
    return <FallbackComponent missingRoles={roles} />;
  }

  // Check if user has required roles
  const hasAccess = mode === 'all' 
    ? roles.every(role => userRoles.includes(role))
    : roles.some(role => userRoles.includes(role));

  // If user doesn't have access, show fallback
  if (!hasAccess) {
    const missingRoles = roles.filter(role => !userRoles.includes(role));
    return <FallbackComponent missingRoles={missingRoles} />;
  }

  // User has access, render children
  return (
    <div className={className}>
      {children}
    </div>
  );
};
