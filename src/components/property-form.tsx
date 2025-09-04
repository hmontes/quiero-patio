"use client";

import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MapSelector } from "@/components/map-selector";

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

interface MapLocation {
  state: string | null;
  municipality: string | null;
  neighborhood: string | null;
  full_address: string;
  state_id: number | null;
  municipality_id: number | null;
  neighborhood_id: number | null;
}

export function PropertyForm() {
  // Estados para los campos del formulario
  const [operationType, setOperationType] = useState("venta");
  const [propertyType, setPropertyType] = useState("casa");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("MXN");
  const [totalSurface, setTotalSurface] = useState("");
  const [constructedSurface, setConstructedSurface] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manejadores de cambio para formateo de números
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value === "") {
      setPrice("");
      return;
    }
    
    // Formatear con separadores de miles
    const formatted = new Intl.NumberFormat("es-MX").format(parseInt(value));
    setPrice(formatted);
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, shouldFormat: boolean = false) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números enteros, sin decimales
    if (shouldFormat && value !== "") {
      // Formatear con separadores de miles
      const formatted = new Intl.NumberFormat("es-MX").format(parseInt(value));
      setter(formatted);
    } else {
      setter(value);
    }
  };

  // Validación para superficie construida (opcional, pero si se proporciona debe ser >= 0)
  const isConstructedSurfaceValid = () => {
    // Si no se proporciona valor, es válido (se asume 0)
    if (constructedSurface === "") return true;
    
    const value = parseFloat(constructedSurface.replace(/,/g, ""));
    return !isNaN(value) && value >= 0;
  };

  // Validación para precio (> 0)
  const isPriceValid = () => {
    const value = price.replace(/,/g, ""); // Remover comas para obtener el valor numérico
    const numericValue = parseInt(value);
    return !isNaN(numericValue) && numericValue > 0;
  };

  // Validación para superficie total (> 0)
  const isTotalSurfaceValid = () => {
    const value = parseFloat(totalSurface.replace(/,/g, ""));
    return !isNaN(value) && value > 0;
  };

  // Validación para baños y habitaciones (opcional, pero si se proporciona debe ser >= 0)
  const isBathroomsValid = () => {
    if (bathrooms === "") return true; // Campo opcional
    const value = parseInt(bathrooms);
    return !isNaN(value) && value >= 0;
  };

  const isBedroomsValid = () => {
    if (bedrooms === "") return true; // Campo opcional
    const value = parseInt(bedrooms);
    return !isNaN(value) && value >= 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setErrors({});
    
    // Validar título
    if (!title.trim()) {
      setErrors(prev => ({ ...prev, title: "El título es obligatorio" }));
      return;
    }
    
    if (title.length < 1 || title.length > 60) {
      setErrors(prev => ({ ...prev, title: "El título debe tener entre 1 y 60 caracteres" }));
      return;
    }
    
    // Validar descripción
    if (!description.trim()) {
      setErrors(prev => ({ ...prev, description: "La descripción es obligatoria" }));
      return;
    }
    
    if (description.length < 10 || description.length > 5000) {
      setErrors(prev => ({ ...prev, description: "La descripción debe tener entre 10 y 5000 caracteres" }));
      return;
    }
    
    // Validar que la ubicación sea obligatoria
    if (!selectedLocation) {
      setErrors(prev => ({ ...prev, location: "Debe seleccionar una ubicación" }));
      return;
    }
    
    // Validar que la ubicación tenga al menos un estado
    const mapLocation = selectedLocation as MapLocation;
    const oldLocation = selectedLocation as Location;
    
    if (!mapLocation.state && !mapLocation.state_id && !oldLocation.state_id) {
      setErrors(prev => ({ ...prev, location: "Debe seleccionar una ubicación válida con estado" }));
      return;
    }
    
    // Validar que todos los campos requeridos sean válidos
    if (!isPriceValid()) {
      setErrors(prev => ({ ...prev, price: "El precio debe ser mayor que cero" }));
      return;
    }
    
    if (!isTotalSurfaceValid()) {
      setErrors(prev => ({ ...prev, totalSurface: "La superficie total debe ser mayor que cero" }));
      return;
    }
    
    // Validar superficie construida (opcional)
    if (!isConstructedSurfaceValid()) {
      setErrors(prev => ({ ...prev, constructedSurface: "La superficie construida debe ser un valor válido mayor o igual a cero" }));
      return;
    }
    
    // Validar campos opcionales
    if (!isBathroomsValid()) {
      setErrors(prev => ({ ...prev, bathrooms: "El número de baños no es válido" }));
      return;
    }
    
    if (!isBedroomsValid()) {
      setErrors(prev => ({ ...prev, bedrooms: "El número de habitaciones no es válido" }));
      return;
    }
    
    // Activar estado de loading
    setIsLoading(true);
    
    // Preparar datos para enviar (remover formato de miles)
    const priceValue = price.replace(/,/g, "");
    const totalSurfaceValue = totalSurface.replace(/,/g, "");
    // Para superficie construida, si no hay valor, enviar 0
    const constructedSurfaceValue = constructedSurface ? constructedSurface.replace(/,/g, "") : "0";
    
    // Preparar datos para enviar al endpoint
    // Convert MapLocation to Location format if needed
    let formattedLocation = selectedLocation;
    let latitude = null;
    let longitude = null;
    
    if ((selectedLocation as MapLocation).state) {
      // Convert MapLocation to Location format
      formattedLocation = {
        id: 0, // This will be set by the backend
        name: (selectedLocation as MapLocation).full_address || "",
        level: (selectedLocation as MapLocation).neighborhood ? "neighborhood" : 
               (selectedLocation as MapLocation).municipality ? "municipality" : "state",
        full_location: (selectedLocation as MapLocation).full_address || "",
        url_slug_path: "", // This will be set by the backend
        state_id: (selectedLocation as MapLocation).state_id || 0,
        municipality_id: (selectedLocation as MapLocation).municipality_id || null,
        neighborhood_id: (selectedLocation as MapLocation).neighborhood_id || null
      };
      
      // Extract coordinates
      latitude = (selectedLocation as MapLocation).latitude || null;
      longitude = (selectedLocation as MapLocation).longitude || null;
    }
    
    const propertyData = {
      operationType,
      propertyType: propertyType === 'casa' ? 1 : propertyType === 'terreno' ? 2 : propertyType,
      title,
      description,
      price: priceValue,
      currency,
      totalSurface: totalSurfaceValue,
      constructedSurface: constructedSurfaceValue,
      bathrooms,
      bedrooms,
      selectedLocation: formattedLocation,
      latitude,
      longitude
    };
    
    // Enviar datos al endpoint
    fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Propiedad creada:', data);
      // Desactivar estado de loading
      setIsLoading(false);
      
      // Redirigir a la página de éxito con los datos de la propiedad
      if (data.property && data.property.id && data.property.slug) {
        window.location.href = `/publicar-propiedad/success?slug=${data.property.slug}-${data.property.id}`;
      } else {
        // En caso de que no se reciba la información esperada, mostrar mensaje de éxito
        alert("Propiedad publicada exitosamente");
      }
    })
    .catch(error => {
      console.error('Error al crear la propiedad:', error);
      // Desactivar estado de loading
      setIsLoading(false);
      // Mostrar error al usuario
      setErrors(prev => ({ ...prev, submit: "Error al publicar la propiedad. Por favor, inténtelo de nuevo." }));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipo de propiedad</CardTitle>
          <CardDescription>Selecciona el tipo de operación y propiedad</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="operation-type">Tipo de operación</Label>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger id="operation-type">
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="renta">Renta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="property-type">Tipo de inmueble</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
          <CardDescription>Detalles principales de la propiedad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej. Hermosa casa en zona residencial" 
              maxLength={60}
              required
            />
            <p className="text-sm text-muted-foreground">{title.length}/60 caracteres</p>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe las características de la propiedad..." 
              rows={5}
              minLength={10}
              maxLength={5000}
              required
            />
            <p className="text-sm text-muted-foreground">{description.length}/5000 caracteres</p>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precios y superficies</CardTitle>
          <CardDescription>Costos y dimensiones de la propiedad</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Precio *</Label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">MXN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                id="price" 
                value={price} 
                onChange={handlePriceChange} 
                placeholder="0" 
                required
                className={price && !isPriceValid() ? "border-red-500" : ""}
              />
            </div>
            {(price && !isPriceValid()) || errors.price ? (
              <p className="text-sm text-red-500">
                {errors.price || "El precio debe ser mayor que cero"}
              </p>
            ) : null}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total-surface">Superficie total (m²) *</Label>
            <Input 
              id="total-surface" 
              value={totalSurface} 
              onChange={(e) => handleSurfaceChange(e, setTotalSurface, true)} 
              placeholder="0" 
              required
              type="text"
              className={totalSurface && !isTotalSurfaceValid() ? "border-red-500" : ""}
            />
            {(totalSurface && !isTotalSurfaceValid()) || errors.totalSurface ? (
              <p className="text-sm text-red-500">
                {errors.totalSurface || "La superficie total debe ser mayor que cero"}
              </p>
            ) : null}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="constructed-surface">Superficie construida (m²)</Label>
            <Input 
              id="constructed-surface" 
              value={constructedSurface} 
              onChange={(e) => handleSurfaceChange(e, setConstructedSurface, true)} 
              placeholder="0" 
              type="text"
              className={constructedSurface && !isConstructedSurfaceValid() ? "border-red-500" : ""}
            />
            {(constructedSurface && !isConstructedSurfaceValid()) || errors.constructedSurface ? (
              <p className="text-sm text-red-500">
                {errors.constructedSurface || "La superficie construida debe ser un valor válido mayor o igual a cero"}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características adicionales</CardTitle>
          <CardDescription>Habitaciones y baños</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Habitaciones</Label>
            <Input 
              id="bedrooms" 
              value={bedrooms} 
              onChange={(e) => setBedrooms(e.target.value.replace(/\D/g, ""))} 
              placeholder="0" 
              type="number"
              min="0"
              className={bedrooms && !isBedroomsValid() ? "border-red-500" : ""}
            />
            {(bedrooms && !isBedroomsValid()) || errors.bedrooms ? (
              <p className="text-sm text-red-500">
                {errors.bedrooms || "El número de habitaciones debe ser un valor válido"}
              </p>
            ) : null}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Baños</Label>
            <Input 
              id="bathrooms" 
              value={bathrooms} 
              onChange={(e) => setBathrooms(e.target.value.replace(/\D/g, ""))} 
              placeholder="0" 
              type="number"
              min="0"
              className={bathrooms && !isBathroomsValid() ? "border-red-500" : ""}
            />
            {(bathrooms && !isBathroomsValid()) || errors.bathrooms ? (
              <p className="text-sm text-red-500">
                {errors.bathrooms || "El número de baños debe ser un valor válido"}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
          <CardDescription>Selecciona la ubicación de la propiedad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <MapSelector 
              onLocationSelect={(location) => setSelectedLocation(location as any)} 
            />
            {selectedLocation && (
              <p className="text-sm text-muted-foreground">
                Ubicación seleccionada: {(selectedLocation as MapLocation).full_address || (selectedLocation as Location).full_location}
              </p>
            )}
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Publicando...
            </>
          ) : (
            "Publicar propiedad"
          )}
        </Button>
      </div>
      {errors.submit && (
        <div className="text-red-500 text-center py-2">
          {errors.submit}
        </div>
      )}
    </form>
  );
}