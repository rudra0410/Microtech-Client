import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default'; // Blue
      case 'admin':
        return 'secondary'; // Gray
      case 'support':
        return 'outline'; // Outlined
      default:
        return 'secondary';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-blue-600';
      case 'admin':
        return 'text-green-600';
      case 'support':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  // Safe function to get user initials
  const getUserInitials = (name: string | undefined): string => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Current User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{user.name || 'Unknown User'}</h3>
            <p className="text-sm text-slate-500">{user.email || 'No email'}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={getRoleBadgeVariant(user.role)}
                className={getRoleColor(user.role)}
              >
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
              </Badge>
              <Badge 
                variant={user.status === 'active' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {user.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Role:</span>
              <p className="font-medium capitalize">{user.role || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-slate-500">Last Login:</span>
              <p className="font-medium">
                {user.lastLogin 
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
          
          <div className="mt-3">
            <span className="text-slate-500 text-sm">User ID:</span>
            <p className="font-mono text-xs text-slate-600 mt-1">{user.id}</p>
          </div>
          
          {user.permissions && user.permissions.length > 0 && (
            <div className="mt-3">
              <span className="text-slate-500 text-sm">Permissions:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.permissions.slice(0, 3).map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
                {user.permissions.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.permissions.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};