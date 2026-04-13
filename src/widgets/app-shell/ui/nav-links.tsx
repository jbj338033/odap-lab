"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, BarChart3, History, BookOpen, Network } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV = [
  { href: "/upload", label: "분석", icon: Upload },
  { href: "/history", label: "이력", icon: History },
  { href: "/dashboard", label: "대시보드", icon: BarChart3 },
  { href: "/knowledge-map", label: "지식 맵", icon: Network },
  { href: "/practice", label: "연습", icon: BookOpen },
];

export function NavLinks({
  onClick,
  vertical,
}: {
  onClick?: () => void;
  vertical?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-0.5", vertical ? "flex-col" : "items-center")}>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              vertical && "py-2.5 px-3",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
