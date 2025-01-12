export enum UserRole {
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    RECRUITER = 'RECRUITER',
    RECRUITER_ADMIN = 'RECRUITER_ADMIN',
}

interface RoleUrlMapping {
    [role: string]: string;
}

export const roleUrlMapping: RoleUrlMapping = {
    [UserRole.ADMIN]: '/corporate/management',
    [UserRole.SUPER_ADMIN]: '/corporate/management',
    [UserRole.RECRUITER]: '/employers/app',
    [UserRole.RECRUITER_ADMIN]: '/recruiter-admin/overview',
    [''] : '/dashboard'
    // Add more role-URL mappings here
};



