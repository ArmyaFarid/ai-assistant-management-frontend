"use client";

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from "next/link";
import {MenuLink} from "@/lib/definitions";

type Props ={
  links? : MenuLink[]
}

export default function NavLinks({links} : Props) {
  const pathname = usePathname();
  return (
    <nav className='flex flex-row justify-center items-center gap-2 xl:gap-[82px] md:flex-row flex-gap'>
      {links && links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex grow items-center justify-center gap-2 p-3 xl:text-lg font-medium hover:text-secondary md:flex-none md:justify-start text-primary',
              {
                'bg-sky-100 text-secondary': pathname === link.href,
              },
            )}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </nav>
  );
}
