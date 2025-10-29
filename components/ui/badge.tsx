import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-[#f3c572] px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#d6960b] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#d6960b] text-white shadow hover:bg-[#b87f09]",
        secondary:
          "border-transparent bg-[#fbe7b2] text-[#6b4700] hover:bg-[#f6d47d]",
        destructive:
          "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80",
        outline: "text-[#3f2c00]",
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
