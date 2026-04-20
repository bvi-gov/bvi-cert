import { NextRequest, NextResponse } from 'next/server';
import { getSession, canImport } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !canImport(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const recordType = formData.get('recordType') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create import job record
    const { data: job, error: jobError } = await supabase
      .from(TABLES.IMPORT_JOBS)
      .insert({
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        status: 'processing',
        started_at: new Date().toISOString(),
        created_by: session.userId,
      })
      .select('id')
      .single();

    if (jobError) {
      return NextResponse.json({ error: 'Failed to create import job' }, { status: 500 });
    }

    // Parse file
    const buffer = Buffer.from(await file.arrayBuffer());
    let records: Record<string, unknown>[] = [];

    if (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.type.includes('csv')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('spreadsheet') || file.type.includes('excel')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet);
    } else if (file.type.includes('json')) {
      records = JSON.parse(buffer.toString('utf-8'));
    } else {
      // For PDF/Word/Text - store as-is for OCR processing later
      await supabase
        .from(TABLES.IMPORT_JOBS)
        .update({
          status: 'completed',
          total_rows: 0,
          imported_rows: 0,
          completed_at: new Date().toISOString(),
          error_log: [{ message: 'File uploaded for OCR processing. Use the OCR scanner to extract data.', file: file.name }],
        })
        .eq('id', job.id);

      return NextResponse.json({
        success: true,
        jobId: job.id,
        message: 'File received. For PDF/Word files, please use the OCR scanning feature to extract data.',
        needsOCR: true,
      });
    }

    // Process records
    let imported = 0;
    let failed = 0;
    const errors: Array<{ row: number; error: string }> = [];

    const batchInserts: Record<string, unknown>[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];

      try {
        const archived = {
          record_type: row['record_type'] || row['Record Type'] || row['type'] || recordType,
          record_year: row['record_year'] || row['Record Year'] || row['year'] ? parseInt(String(row['record_year'] || row['year'])) : null,
          district: row['district'] || row['District'] || row['island'] || null,
          community: row['community'] || row['Community'] || row['settlement'] || null,
          surname: row['surname'] || row['Surname'] || row['last_name'] || row['Last Name'] || null,
          given_names: row['given_names'] || row['Given Names'] || row['first_name'] || row['First Name'] || null,
          date_of_birth: row['date_of_birth'] || row['Date of Birth'] || row['dob'] ? new Date(String(row['date_of_birth'] || row['dob'])).toISOString() : null,
          date_of_event: row['date_of_event'] || row['Date of Event'] || row['event_date'] ? new Date(String(row['date_of_event'] || row['event_date'])).toISOString() : null,
          event_type: row['event_type'] || row['Event Type'] || null,
          certificate_number: row['certificate_number'] || row['Certificate Number'] || row['cert_number'] || null,
          details: row,
          source_file: file.name,
          source_type: file.type,
          imported_by: session.userId,
          folder_path: `/${recordType}/${row['district'] || 'Unknown'}/${row['record_year'] || 'Unknown'}`,
        };

        batchInserts.push(archived);
        imported++;
      } catch {
        failed++;
        errors.push({ row: i + 1, error: 'Failed to parse row' });
      }
    }

    // Insert in batches of 100
    for (let i = 0; i < batchInserts.length; i += 100) {
      const batch = batchInserts.slice(i, i + 100);
      await supabase.from(TABLES.ARCHIVED).insert(batch);
    }

    // Update import job
    await supabase
      .from(TABLES.IMPORT_JOBS)
      .update({
        status: 'completed',
        total_rows: records.length,
        imported_rows: imported,
        failed_rows: failed,
        completed_at: new Date().toISOString(),
        error_log: errors,
      })
      .eq('id', job.id);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      total: records.length,
      imported,
      failed,
      errors,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}

// GET - Import history
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from(TABLES.IMPORT_JOBS)
    .select('*, creator:users!import_jobs_created_by_fkey(id, full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: 'Failed to load imports' }, { status: 500 });

  return NextResponse.json({ imports: data || [] });
}
