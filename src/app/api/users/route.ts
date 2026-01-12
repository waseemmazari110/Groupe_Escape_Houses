import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current session
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Prevent user from deleting themselves
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account. Please ask another admin to do this.' },
        { status: 403 }
      );
    }

    // Get the user to be deleted
    const userToDelete = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (userToDelete.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the user
    await db.delete(userTable).where(eq(userTable.id, userId));

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
