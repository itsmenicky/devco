"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import GithubButton from "./github-button"
import HowWorksButton from "./how-works-button"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            entre na sua conta
          </span>
        </div>
      </div>
      <GithubButton />
      <HowWorksButton />
    </div>
  )
}