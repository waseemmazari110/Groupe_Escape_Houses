import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const limitParam = searchParams.get('limit');

    const conditions: any[] = [];

    if (role && role !== 'all') {
      conditions.push(eq(userTable.role, role));
    }

    if (search) {
      conditions.push(
        or(
          like(userTable.name, `%${search}%`),
          like(userTable.email, `%${search}%`)
        )
      );
    }

    let query = db.select().from(userTable);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let users = await query;

    // Limit results if specified
    if (limitParam) {
      const limit = parseInt(limitParam);
      users = users.slice(0, limit);
    }

    return NextResponse.json(
      { users },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
