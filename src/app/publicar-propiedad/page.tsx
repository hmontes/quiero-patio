import type { Metadata } from "next";
import { PropertyForm } from "@/components/property-form";

export const metadata: Metadata = {
  title: "Publicar propiedad - Quiero Patio",
  description: "Publica tu propiedad en Quiero Patio para encontrar compradores o inquilinos",
};

export default function PublishPropertyPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Publicar nueva propiedad</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <PropertyForm />
        </div>
      </div>
    </div>
  );
}