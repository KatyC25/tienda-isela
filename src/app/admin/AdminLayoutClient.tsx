"use client";

import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 transition-all duration-300">
      <div className="hidden lg:block h-screen sticky top-0 z-40 shadow-xl">
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-4 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              {isMounted && (
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6 text-slate-700" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="p-0 w-72 bg-slate-900 border-r-slate-800 border-none"
                  >
                    <SheetTitle className="hidden">Menú</SheetTitle>
                    <Sidebar
                      isMobile={true}
                      onClose={() => setIsMobileOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-slate-500"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>

            <span className="font-semibold text-slate-700 lg:hidden">
              Tienda Isela
            </span>
          </div>

          <div className="text-sm text-slate-500 hidden lg:block">
            Hola, <strong>Isela</strong>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
