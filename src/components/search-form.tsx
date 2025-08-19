"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LocationAutocomplete } from "@/components/location-autocomplete";
import { generateSearchResultsUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Location {
  id: number;
  name: string;
  level: string;
  full_location: string;
  url_slug_path: string;
  state_id: number;
  municipality_id: number | null;
  neighborhood_id: number | null;
}

export function SearchForm() {
  const router = useRouter();
  const [operation, setOperation] = useState("rentar");
  const [propertyType, setPropertyType] = useState("casa");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSearch = () => {
    const url = generateSearchResultsUrl(propertyType, operation, selectedLocation);
    router.push(url);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full max-w-3xl">
      <Select value={operation} onValueChange={setOperation}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Tipo de operación" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rentar">Rentar</SelectItem>
          <SelectItem value="comprar">Comprar</SelectItem>
        </SelectContent>
      </Select>

      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Tipo de propiedad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="casa">Casa</SelectItem>
          <SelectItem value="terreno">Terreno</SelectItem>
        </SelectContent>
      </Select>

      <LocationAutocomplete onSelect={handleLocationSelect} />
      <Button onClick={handleSearch}>Buscar</Button>
    </div>
  );
}
