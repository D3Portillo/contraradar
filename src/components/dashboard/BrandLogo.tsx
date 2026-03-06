import Link from "next/link"
import Image from "next/image"

import asset_icon from "@/assets/icon.svg"

interface BrandLogoProps {
  onClick?: () => void
}

export function BrandLogo({ onClick }: BrandLogoProps) {
  return (
    <Link
      href="/"
      title="Go to main page"
      className="flex gap-1 items-center select-none"
      onClick={onClick}
    >
      <div className="w-6">
        <Image alt="Radar logo" src={asset_icon} />
      </div>
      <span className="text-xl font-bold">RADAR</span>
    </Link>
  )
}
