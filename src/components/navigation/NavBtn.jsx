import { Github, Home, Linkedin, Microscope, NotebookTextIcon, Palette, Phone, Twitter, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const getIcon = (icon) => {
  switch (icon) {
    case "home":
      return <Home className="w-full h-auto" strokeWidth={1.5} />;
    case "about":
      return <User className="w-full h-auto" strokeWidth={1.5} />;
    case "projects":
      return <Palette className="w-full h-auto" strokeWidth={1.5} />;
    case "contact":
      return <Phone className="w-full h-auto" strokeWidth={1.5} />;
    case "github":
      return <Github className="w-full h-auto" strokeWidth={1.5} />;
    case "linkedin":
      return <Linkedin className="w-full h-auto" strokeWidth={1.5} />;
    case "research":
      return <Microscope  className="w-full h-auto" strokeWidth={1.5} />;
    case 'resume':
        return <NotebookTextIcon className='w-full h-auto' strokeWidth={1.5} />

    default:
      return <Home className="w-full h-auto" strokeWidth={1.5} />;
  }
};

const NavBtn = ({ x, y, label, link, icon, newTab }) => {
  return (
    <div
      className="absolute cursor-pointer z-50"
      style={{ transform: `translate(${x},${y})` }}
    >
      <Link
        aria-label={label}
        className="text-foreground rounded-full flex items-center 
        justify-center bg-background/20 border border-accent/30 border-solid backdrop-blur-[6px] shadow-glass-inset
        hover:shadow-glass-sm"
        href={link}
        target={newTab ? "_blank" : "_self"}
        name={label}
      >
        <span className="relattive w-14 h-14 p-4 animate-spin-slow-reverse">{getIcon(icon)}</span>
      </Link>
    </div>
  );
};

export default NavBtn;
