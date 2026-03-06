import Link from "next/link";
import Image from "next/image";

import asset_logo from "@/assets/logo.svg";

export function Footer() {
  return (
    <footer className="border-t py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block w-32 mb-4 focus:outline-2 focus:outline-offset-2 focus:outline-ring">
              <Image className="w-full" alt="Contraradar" src={asset_logo} />
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Contraradar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
