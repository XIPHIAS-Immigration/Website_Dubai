// Address of the auto-made brochure for a programme or country page.
// Kept free of server-only imports so any component can use it.
export function brochureHref(vertical: string, country: string, program?: string): string {
  return program ? `/brochures/${vertical}/${country}/${program}.pdf` : `/brochures/${vertical}/${country}.pdf`;
}
