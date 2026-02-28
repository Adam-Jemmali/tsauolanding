import { Instagram, Mail, Music2 } from "lucide-react";

const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/tsa.uottawa/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.tiktok.com/@tsa.uottawa",
    label: "TikTok",
    icon: Music2,
  },
  {
    href: "mailto:tsa.uottawa.club@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span>TSA @ uOttawa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Celebrating Tunisian culture and building community at University
              of Ottawa. Open to all students who want to experience our vibrant
              culture.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={
                      link.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-brand-blue hover:text-white"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 TSA @ University of Ottawa.
          </p>
        </div>
      </div>
    </footer>
  );
}
