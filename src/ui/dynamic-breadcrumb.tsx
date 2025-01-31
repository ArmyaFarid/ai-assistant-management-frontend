'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';  // Import usePathname from next/navigation
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
    href: string;
    label: string;
}

const DynamicBreadcrumb = () => {
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
    const pathname = usePathname();  // Use pathname from next/navigation

    // Update breadcrumb items based on the current pathname
    useEffect(() => {
        if (pathname) {
            const path = pathname.split('/').filter((segment) => segment);  // Split the path by "/"
            const items = path.map((segment, index) => {
                const href = '/' + path.slice(0, index + 1).join('/');  // Create the URL for each breadcrumb item
                // Convert segments to readable labels (e.g., "data-fetching" -> "Data Fetching")
                const label = segment
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return { href, label };
            });
            setBreadcrumbItems(items);
        }
    }, [pathname]);  // Trigger on pathname changes

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbLink href={item.href}>
                            {item.label}
                        </BreadcrumbLink>
                        {index < breadcrumbItems.length - 1 && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;
