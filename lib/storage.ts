import { supabase } from './supabase';

// Storage bucket configuration
export const STORAGE_BUCKET = 'case-documents';

/**
 * Upload a document to Supabase Storage
 * 
 * @param file - The file to upload
 * @param organizationId - The organization ID
 * @param caseId - The case ID
 * @param userId - The user uploading the file
 * @returns The public URL of the uploaded file
 */
export async function uploadDocument(
  file: File,
  organizationId: string,
  caseId: string,
  userId: string
): Promise<{ success: boolean; url?: string; error?: string; path?: string }> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${organizationId}/${caseId}/${timestamp}_${sanitizedName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { 
      success: true, 
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete a document from Supabase Storage
 * 
 * @param filePath - The storage path of the file
 */
export async function deleteDocument(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get a signed URL for private document access
 * 
 * @param filePath - The storage path of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600)
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * List documents for a specific case
 * 
 * @param organizationId - The organization ID
 * @param caseId - The case ID
 */
export async function listCaseDocuments(
  organizationId: string,
  caseId: string
): Promise<{ success: boolean; files?: unknown[]; error?: string }> {
  try {
    const folderPath = `${organizationId}/${caseId}/`;
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, files: data || [] };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Storage bucket policy examples (to be run in Supabase SQL Editor):
 * 
-- Enable RLS on storage bucket
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policy for organization-based access
CREATE POLICY "Organization members can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'case-documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text 
    FROM memberships 
    WHERE user_id = auth.uid()
  )
);

-- Create policy for viewing documents
CREATE POLICY "Organization members can view documents"
ON storage.objects FOR SELECT
WHERE bucket_id = 'case-documents'
AND (storage.foldername(name))[1] IN (
  SELECT organization_id::text 
  FROM memberships 
  WHERE user_id = auth.uid()
);

-- Create policy for clients viewing their case documents
CREATE POLICY "Clients can view their case documents"
ON storage.objects FOR SELECT
WHERE bucket_id = 'case-documents'
AND EXISTS (
  SELECT 1 FROM cases c
  JOIN memberships m ON m.organization_id = c.organization_id
  WHERE c.id = (storage.foldername(name))[2]
  AND m.user_id = auth.uid()
  AND m.role = 'client'
);
*/
