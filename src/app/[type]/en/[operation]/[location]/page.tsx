import { getPropertyTypeForUrl, getOperationForUrl } from "@/lib/utils";

interface SearchResultsPageProps {
  params: {
    type: string;
    operation: string;
    location: string;
  };
}

export default function SearchResultsPage({ params }: SearchResultsPageProps) {
  const { type, operation, location } = params;
  
  // Convertir los parámetros a texto legible
  const propertyTypeText = type.charAt(0).toUpperCase() + type.slice(1);
  const operationText = operation === "renta" ? "renta" : "venta";
  
  // Parsear la ubicación
  const locationParts = location.split("-");
  let locationText = "";
  
  if (locationParts.length === 1) {
    // Solo estado
    locationText = locationParts[0].replace(/\b\w/g, (l) => l.toUpperCase());
  } else if (locationParts.length === 2) {
    // Municipio y estado
    locationText = `${locationParts[0].replace(/\b\w/g, (l) => l.toUpperCase())}, ${locationParts[1].replace(/\b\w/g, (l) => l.toUpperCase())}`;
  } else if (locationParts.length >= 3) {
    // Colonia, municipio y estado (o más partes)
    const colony = locationParts[0].replace(/\b\w/g, (l) => l.toUpperCase());
    const municipality = locationParts[1].replace(/\b\w/g, (l) => l.toUpperCase());
    const state = locationParts.slice(2).join(" ").replace(/\b\w/g, (l) => l.toUpperCase());
    locationText = `${colony}, ${municipality}, ${state}`;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">
        {locationText 
          ? `${propertyTypeText} en ${operationText} en ${locationText}` 
          : `${propertyTypeText} en ${operationText}`}
      </h1>
      <p>Esta es una página dummy que muestra los resultados de búsqueda.</p>
      <p>Parámetros recibidos:</p>
      <ul>
        <li>Tipo de propiedad: {type}</li>
        <li>Operación: {operation}</li>
        <li>Ubicación: {location}</li>
      </ul>
    </div>
  );
}