import {roleUrlMapping, UserRole} from "@/lib/roles";

export function getUrlForRole(role: UserRole): string  {
    return roleUrlMapping[role] || '/dashboard';
}
