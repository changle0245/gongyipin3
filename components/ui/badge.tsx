import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-[#f3d27a] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8c5800] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#f5b400] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#fbe8a1] text-[#6b4600]",
        secondary: "bg-[#fff5cf] text-[#8c5800]",
        destructive: "border-transparent bg-red-500 text-white",
        outline: "bg-transparent text-[#8c5800]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
