import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#f3d27a] bg-white/90 px-4 text-sm text-[#4b3600] shadow-inner shadow-[#fbe8a1]/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b400] focus-visible:ring-offset-1 placeholder:text-[#b38b3c] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
