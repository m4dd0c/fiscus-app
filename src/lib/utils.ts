import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuidFromUrl(resourceUrl: string): string {
  const lastSlash = resourceUrl.lastIndexOf("/");
  return resourceUrl.substring(lastSlash + 1).trim();
}
