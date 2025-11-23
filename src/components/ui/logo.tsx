"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-32 bg-muted animate-pulse rounded" />
  }

  const src =
    resolvedTheme === "dark"
      ? "/images/logo-black.JPG"
      : "/images/logo-red.JPG"

  return (
    <div className="relative h-12 w-auto aspect-[3/1] overflow-hidden rounded-md">
      <Image
        src={src}
        alt="Smart Race Pacer Logo"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  )
}
