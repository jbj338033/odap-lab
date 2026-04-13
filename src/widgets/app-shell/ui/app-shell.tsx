"use client";

import Link from "next/link";
import { Menu, FlaskConical } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { useState } from "react";
import { NavLinks } from "./nav-links";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <FlaskConical className="h-4 w-4 text-primary" />
      <span className="text-[13px] font-semibold tracking-tight">
        오답연구소
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-56 border-l border-border bg-background p-0">
              <div className="flex h-14 items-center border-b border-border px-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </div>
              <div className="px-2 py-3">
                <NavLinks onClick={() => setOpen(false)} vertical />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
