import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { slugify, generateUniqueSlug } from '@/lib/utils'

// Configurar el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Función para validar los datos de la propiedad
function validatePropertyData(data: any) {
  const errors: string[] = []
  
  // Validar tipo de operación
  if (!data.operationType || !['venta', 'renta'].includes(data.operationType)) {
    errors.push('El tipo de operación debe ser "venta" o "renta"')
  }
  
  // Validar tipo de propiedad
  if (!data.propertyType || (data.propertyType !== 1 && data.propertyType !== 2)) {
    errors.push('El tipo de propiedad debe ser un ID válido (1 para casa, 2 para terreno)')
  }
  
  // Validar título
  if (!data.title || typeof data.title !== 'string') {
    errors.push('El título es obligatorio y debe ser un texto')
  } else if (data.title.length < 1 || data.title.length > 60) {
    errors.push('El título debe tener entre 1 y 60 caracteres')
  }
  
  // Validar descripción
  if (!data.description || typeof data.description !== 'string') {
    errors.push('La descripción es obligatoria y debe ser un texto')
  } else if (data.description.length < 10 || data.description.length > 5000) {
    errors.push('La descripción debe tener entre 10 y 5000 caracteres')
  }
  
  // Validar precio
  if (!data.price || isNaN(parseInt(data.price))) {
    errors.push('El precio es obligatorio y debe ser un número')
  } else if (parseInt(data.price) <= 0) {
    errors.push('El precio debe ser mayor que cero')
  }
  
  // Validar moneda
  if (!data.currency || !['MXN', 'USD'].includes(data.currency)) {
    errors.push('La moneda debe ser "MXN" o "USD"')
  }
  
  // Validar superficie total
  if (!data.totalSurface || isNaN(parseFloat(data.totalSurface))) {
    errors.push('La superficie total es obligatoria y debe ser un número')
  } else if (parseFloat(data.totalSurface) <= 0) {
    errors.push('La superficie total debe ser mayor que cero')
  }
  
  // Validar superficie construida (opcional, pero si se proporciona debe ser >= 0)
  if (data.constructedSurface && (isNaN(parseFloat(data.constructedSurface)) || parseFloat(data.constructedSurface) < 0)) {
    errors.push('La superficie construida debe ser un número válido mayor o igual a cero')
  }
  
  // Validar baños (opcional)
  if (data.bathrooms && (isNaN(parseInt(data.bathrooms)) || parseInt(data.bathrooms) < 0)) {
    errors.push('El número de baños debe ser un número válido mayor o igual a cero')
  }
  
  // Validar habitaciones (opcional)
  if (data.bedrooms && (isNaN(parseInt(data.bedrooms)) || parseInt(data.bedrooms) < 0)) {
    errors.push('El número de habitaciones debe ser un número válido mayor o igual a cero')
  }
  
  // Validar ubicación
  if (!data.selectedLocation || typeof data.selectedLocation !== 'object') {
    errors.push('La ubicación es obligatoria')
  } else {
    if (!data.selectedLocation.state_id) {
      errors.push('La ubicación debe incluir el ID del estado')
    }
  }
  
  // Validar coordenadas (opcional)
  if (data.latitude !== undefined && data.latitude !== null) {
    if (isNaN(parseFloat(data.latitude)) || parseFloat(data.latitude) < -90 || parseFloat(data.latitude) > 90) {
      errors.push('La latitud debe ser un número válido entre -90 y 90')
    }
  }
  
  if (data.longitude !== undefined && data.longitude !== null) {
    if (isNaN(parseFloat(data.longitude)) || parseFloat(data.longitude) < -180 || parseFloat(data.longitude) > 180) {
      errors.push('La longitud debe ser un número válido entre -180 y 180')
    }
  }
  
  return errors
}

// Función para verificar que las ubicaciones existan en la base de datos
async function validateLocationReferences(location: any) {
  const errors: string[] = []
  
  // Verificar que el estado exista
  if (location.state_id) {
    const { data: state, error: stateError } = await supabase
      .from('states')
      .select('id')
      .eq('id', location.state_id)
      .single()
    
    if (stateError || !state) {
      errors.push('El estado seleccionado no existe')
    }
  }
  
  // Verificar que el municipio exista si se proporciona
  if (location.municipality_id) {
    const { data: municipality, error: municipalityError } = await supabase
      .from('municipalities')
      .select('id')
      .eq('id', location.municipality_id)
      .single()
    
    if (municipalityError || !municipality) {
      errors.push('El municipio seleccionado no existe')
    }
    
    // Verificar que el municipio pertenezca al estado
    if (!municipalityError && municipality && location.state_id) {
      const { data: municipalityState, error: municipalityStateError } = await supabase
        .from('municipalities')
        .select('state_id')
        .eq('id', location.municipality_id)
        .single()
      
      if (!municipalityStateError && municipalityState && municipalityState.state_id !== location.state_id) {
        errors.push('El municipio no pertenece al estado seleccionado')
      }
    }
  }
  
  // Verificar que la colonia exista si se proporciona
  if (location.neighborhood_id) {
    const { data: neighborhood, error: neighborhoodError } = await supabase
      .from('neighborhoods')
      .select('id')
      .eq('id', location.neighborhood_id)
      .single()
    
    if (neighborhoodError || !neighborhood) {
      errors.push('La colonia seleccionada no existe')
    }
    
    // Verificar que la colonia pertenezca al municipio
    if (!neighborhoodError && neighborhood && location.municipality_id) {
      const { data: neighborhoodMunicipality, error: neighborhoodMunicipalityError } = await supabase
        .from('neighborhoods')
        .select('municipality_id')
        .eq('id', location.neighborhood_id)
        .single()
      
      if (!neighborhoodMunicipalityError && neighborhoodMunicipality && neighborhoodMunicipality.municipality_id !== location.municipality_id) {
        errors.push('La colonia no pertenece al municipio seleccionado')
      }
    }
  }
  
  return errors
}

// Función para manejar errores de validación
function handleValidationError(errors: string[]) {
  return NextResponse.json(
    { 
      error: 'Errores de validación', 
      details: errors,
      timestamp: new Date().toISOString()
    },
    { status: 400 }
  )
}

// Función para manejar errores de base de datos
function handleDatabaseError(error: any) {
  console.error('Error de base de datos:', error)
  
  // Errores de constraint de base de datos
  if (error.code === '23503') { // foreign_key_violation
    return NextResponse.json(
      { 
        error: 'Error de integridad referencial', 
        message: 'Una o más referencias no son válidas',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
  
  if (error.code === '23505') { // unique_violation
    return NextResponse.json(
      { 
        error: 'Error de unicidad', 
        message: 'Ya existe un registro con estos datos',
        timestamp: new Date().toISOString()
      },
      { status: 409 }
    )
  }
  
  // Error genérico de base de datos
  return NextResponse.json(
    { 
      error: 'Error en la base de datos', 
      message: 'No se pudo completar la operación debido a un error en la base de datos',
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  )
}

// Función para manejar errores inesperados
function handleUnexpectedError(error: any) {
  console.error('Error inesperado:', error)
  
  return NextResponse.json(
    { 
      error: 'Error interno del servidor', 
      message: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.',
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  )
}

export async function POST(request: Request) {
  try {
    // Verificar que el content-type sea JSON
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { 
          error: 'Content-Type inválido', 
          message: 'Se esperaba application/json',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Obtener los datos del formulario
    const body = await request.json()
    
    // Extraer los campos del body
    const {
      operationType,
      propertyType,
      title,
      description,
      price,
      currency,
      totalSurface,
      constructedSurface,
      bathrooms,
      bedrooms,
      selectedLocation,
      latitude,
      longitude
    } = body
    
    // Validar datos del formulario
    const validationErrors = validatePropertyData({
      operationType,
      propertyType,
      title,
      description,
      price,
      currency,
      totalSurface,
      constructedSurface,
      bathrooms,
      bedrooms,
      selectedLocation,
      latitude,
      longitude
    })
    
    if (validationErrors.length > 0) {
      return handleValidationError(validationErrors)
    }
    
    // Validar que las ubicaciones referenciadas existan
    const locationErrors = await validateLocationReferences(selectedLocation)
    
    if (locationErrors.length > 0) {
      return handleValidationError(locationErrors)
    }
    
    // Función para verificar si un slug ya existe
    const checkSlugExists = async (slug: string): Promise<boolean> => {
      const { data: existingProperty, error: checkError } = await supabase
        .from('properties')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Error diferente a "no se encontró registro"
        throw checkError
      }
      
      return !!existingProperty
    }
    
    // Generar slug único para la propiedad
    let slug: string
    try {
      slug = await generateUniqueSlug(title, checkSlugExists)
    } catch (error) {
      return handleDatabaseError(error)
    }
    
    // Preparar datos para insertar
    // Para superficie construida, si no hay valor, usar 0
    const constructedSurfaceValue = constructedSurface ? parseFloat(constructedSurface) : 0;
    
    const propertyData = {
      operation_type: operationType,
      property_type_id: propertyType,
      title,
      description,
      price: parseInt(price),
      currency,
      total_surface: parseFloat(totalSurface),
      constructed_surface: constructedSurfaceValue,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      state_id: selectedLocation.state_id,
      municipality_id: selectedLocation.municipality_id,
      neighborhood_id: selectedLocation.neighborhood_id,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      slug
    }
    
    // Insertar la propiedad en la base de datos
    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Devolver solo el ID y slug de la propiedad creada para redirección
    return NextResponse.json(
      { 
        message: 'Propiedad creada exitosamente',
        property: {
          id: data.id,
          slug: data.slug
        },
        timestamp: new Date().toISOString()
      }, 
      { status: 201 }
    )
  } catch (error: any) {
    // Manejar errores específicos
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'JSON inválido', 
          message: 'El cuerpo de la solicitud no es un JSON válido',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    return handleUnexpectedError(error)
  }
}