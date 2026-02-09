import React from "react";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("lg:px-24 xl:px-30 px-4 sm:px-8 ", className)}>
      {children}
    </div>
  );
}
