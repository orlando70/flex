"use client";
import { Menu, ChevronDown, Building2, Info, BookOpen, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`w-full fixed top-0 left-0 z-50 transition-colors ${isScrolled ? 'bg-background' : 'bg-foreground'}`}>
      <div className="container px-4">
        <nav className={`flex items-center justify-between h-[88px] ${isScrolled ? 'text-foreground' : 'text-background'}`}>
          <Link href="/" className="flex items-center">
            <Image
              alt="The Flex"
              width="120"
              height="40"
              className="object-contain"
              src={isScrolled ? "https://theflex.global/_next/image?url=https%3A%2F%2Flsmvmmgkpbyqhthzdexc.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fwebsite%2FUploads%2FWhite_V3%2520Symbol%2520%26%2520Wordmark.png&w=128&q=75" : "https://lsmvmmgkpbyqhthzdexc.supabase.co/storage/v1/object/public/website/Uploads/Green_V3%20Symbol%20%26%20Wordmark%20(1).png"}
            />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 ${isScrolled ? 'text-foreground' : 'text-background'}`}>
              <Building2 className="h-4 w-4 mr-2" />
              Landlords
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <Link href="/about-us" className={`font-medium ${isScrolled ? 'text-foreground' : 'text-background'}`}>
              <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 ${isScrolled ? 'text-foreground' : 'text-background'}`}>
                <Info className="h-4 w-4 mr-2" />
                About Us
              </button>
            </Link>
            <Link href="/careers" className={`font-medium ${isScrolled ? 'text-foreground' : 'text-background'}`}>
              <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 ${isScrolled ? 'text-foreground' : 'text-background'}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Careers
              </button>
            </Link>
            <Link href="/contact" className={`font-medium ${isScrolled ? 'text-foreground' : 'text-background'}`}>
              <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 ${isScrolled ? 'text-foreground' : 'text-background'}`}>
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </button>
            </Link>
            <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 ${isScrolled ? 'text-foreground' : 'text-background'}`}>
              <span className="flex items-center">
                <span className="pr-4">🇬🇧</span>
                English
              </span>
            </button>
            <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 ${isScrolled ? 'text-foreground' : 'text-background'}`}>
              <span className="flex items-center">
                <span className="pr-4">£</span>
                GBP
              </span>
            </button>
          </div>
          <div className="md:hidden">
            <button>
              <Menu />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}