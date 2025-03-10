import { NextResponse } from 'next/server';

/**
 * Standard error response types for API consistency
 */
export type ApiErrorType = 
  | 'UNAUTHORIZED'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'INTERNAL_SERVER_ERROR'
  | 'VALIDATION_ERROR';

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  error: {
    type: ApiErrorType;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  type: ApiErrorType,
  message: string,
  details?: Record<string, any>,
  status?: number
) {
  // Map error types to status codes if not explicitly provided
  const statusMap: Record<ApiErrorType, number> = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    VALIDATION_ERROR: 422,
  };

  const responseStatus = status || statusMap[type];
  
  // Log server errors to help with debugging
  if (type === 'INTERNAL_SERVER_ERROR') {
    console.error(`API Error: ${message}`, details);
  }

  return NextResponse.json(
    {
      error: {
        type,
        message,
        ...(details ? { details } : {}),
      },
    } as ApiErrorResponse,
    { status: responseStatus }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, defaultMessage = 'An unexpected error occurred') {
  console.error('API Error:', error);
  
  // Handle known error types
  if (error instanceof Error) {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      error.message || defaultMessage
    );
  }
  
  // Handle unknown errors
  return createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    defaultMessage
  );
} 